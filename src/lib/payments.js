import { supabase } from "./supabase";

// Payment processing. Two modes (VITE_PAYMENTS_MODE):
// - "demo": simulated checkout, nothing is charged (for testing).
// - "razorpay": real Razorpay checkout, needs VITE_RAZORPAY_KEY_ID.
//
// Returns { provider, providerPaymentId }. Throws with a clear message
// when payment is cancelled or cannot start.

const mode = (import.meta.env.VITE_PAYMENTS_MODE || "demo").toLowerCase();
const razorKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

export function paymentsMode() {
  return mode;
}

export function paymentsReady() {
  if (mode === "razorpay") return Boolean(razorKey);
  return true;
}

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Could not load the payment gateway. Check your connection and retry."));
    document.body.appendChild(script);
  });
}

function demoCheckout(amount, courseTitle, onProgress) {
  return new Promise((resolve) => {
    if (onProgress) onProgress("Contacting bank…");
    setTimeout(() => {
      if (onProgress) onProgress("Confirming payment…");
      setTimeout(() => {
        resolve({
          provider: "demo",
          providerPaymentId: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        });
      }, 1200);
    }, 900);
  });
}

function razorpayCheckout({ amount, courseTitle, studentEmail }) {
  return new Promise(async (resolve, reject) => {
    try {
      await loadRazorpay();
    } catch (e) {
      reject(e);
      return;
    }
    const rzp = new window.Razorpay({
      key: razorKey,
      amount: Math.round(Number(amount) * 100), // paise
      currency: "INR",
      name: "LearnLoop",
      description: courseTitle,
      prefill: { email: studentEmail || "" },
      theme: { color: "#F5820B" },
      handler(response) {
        resolve({ provider: "razorpay", providerPaymentId: response.razorpay_payment_id });
      },
      modal: {
        ondismiss() {
          reject(new Error("Payment was cancelled."));
        },
      },
    });
    rzp.on("payment.failed", () => reject(new Error("Payment failed. Please try again.")));
    rzp.open();
  });
}

export async function processPayment({ amount, courseTitle, studentEmail, onProgress }) {
  if (mode === "razorpay") {
    if (!razorKey) throw new Error("Razorpay is selected but VITE_RAZORPAY_KEY_ID is missing.");
    return razorpayCheckout({ amount, courseTitle, studentEmail });
  }
  return demoCheckout(amount, courseTitle, onProgress);
}

// Persist a completed payment + enrollment. RLS allows owners to insert
// their own rows; duplicate enrollments are treated as already-enrolled.
export async function recordPurchase({ studentId, studentEmail, courseDbId, amount, provider, providerPaymentId }) {
  const client = supabase();
  const { data: existing } = await client
    .from("enrollments")
    .select("id")
    .eq("student_id", studentId)
    .eq("course_id", courseDbId)
    .maybeSingle();
  if (existing) return { alreadyEnrolled: true };

  const { error: payErr } = await client.from("payments").insert({
    student_id: studentId,
    student_email: studentEmail || null,
    course_id: courseDbId,
    amount: Number(amount) || 0,
    currency: "INR",
    provider,
    provider_payment_id: providerPaymentId || null,
    status: "completed",
  });
  if (payErr) throw new Error(`Could not record payment: ${payErr.message}`);

  const { error: enrErr } = await client.from("enrollments").insert({
    student_id: studentId,
    student_email: studentEmail || null,
    course_id: courseDbId,
    progress: 0,
    status: "active",
  });
  if (enrErr) throw new Error(`Payment done, but enrollment failed: ${enrErr.message}. Contact support.`);
  return { alreadyEnrolled: false };
}
