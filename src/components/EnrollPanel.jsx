import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { processPayment, recordPurchase, paymentsMode } from "../lib/payments";
import { formatPrice } from "../lib/coursesApi";

// Enroll → pay → enrolled state machine shared by the course page.
// Free courses skip payment. Paid courses run the configured gateway
// (demo checkout or Razorpay) and only then create payment + enrollment,
// so the course unlocks for that specific user after successful payment.
export default function EnrollPanel({ course, uid, email, enrolled, progress, onEnrolled }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [payMsg, setPayMsg] = useState("");
  const [error, setError] = useState("");
  const price = Number(course.price) || 0;

  if (enrolled) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full px-7 py-3 text-sm font-extrabold bg-[#191817] text-white">
          Enrolled ✓ {progress}%
        </span>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full px-7 py-3 text-sm font-extrabold bg-[#F5820B] text-white hover:bg-[#E06F00] transition"
        >
          Go to dashboard
        </button>
      </div>
    );
  }

  const start = async () => {
    if (!uid) {
      navigate("/login");
      return;
    }
    setBusy(true);
    setError("");
    setPayMsg(price > 0 ? "Starting secure checkout…" : "Enrolling…");
    try {
      let provider = "free";
      let providerPaymentId = null;
      if (price > 0) {
        const res = await processPayment({
          amount: price,
          courseTitle: course.title,
          studentEmail: email,
          onProgress: setPayMsg,
        });
        provider = res.provider;
        providerPaymentId = res.providerPaymentId;
      }
      await recordPurchase({
        studentId: uid,
        studentEmail: email,
        courseDbId: course.id,
        amount: price,
        provider,
        providerPaymentId,
      });
      setPayMsg("");
      onEnrolled();
    } catch (e) {
      setError(e.message || "Payment failed. Please try again.");
      setPayMsg("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={start}
          disabled={busy}
          className="rounded-full px-7 py-3 text-sm font-extrabold transition bg-[#F5820B] text-white hover:bg-[#E06F00] disabled:opacity-50"
        >
          {busy ? "Processing…" : price > 0 ? `Enroll for ${formatPrice(price)}` : "Enroll for free"}
        </button>
        <button onClick={() => navigate("/courses")} className="rounded-lg border border-gray-300 bg-white px-7 py-3 text-sm font-bold hover:border-black transition">
          Back
        </button>
      </div>
      {price > 0 && (
        <p className="text-[12px] text-gray-500 mt-2">
          Secure checkout{paymentsMode() === "demo" ? " (demo mode — no real money moves)" : " via Razorpay"}. Access unlocks immediately after payment.
        </p>
      )}
      {busy && payMsg && <p className="text-[13px] font-semibold text-gray-700 mt-3">{payMsg}…</p>}
      {error && <p className="mt-3 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
    </div>
  );
}
