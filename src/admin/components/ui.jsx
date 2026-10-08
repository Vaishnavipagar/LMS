import { useEffect, useState } from "react";

// Shared admin primitives: spinner, form fields, confirm dialog, toasts,
// badges, empty states. One file, no duplicates.

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-sm text-gray-500" role="status">
      <span className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-[#F5820B] animate-spin" />
      {label}
    </div>
  );
}

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-bold text-[#191817] mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-[12px] font-semibold text-red-600 mt-1">{error}</span>}
      {!error && hint && <span className="block text-[11px] text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20 disabled:bg-gray-50 disabled:text-gray-400";

export function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} rows={props.rows || 4} className={`${inputCls} resize-y ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputCls} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-[#F5820B] text-white text-sm font-bold px-6 py-2.5 hover:bg-[#E06F00] transition disabled:opacity-50 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full border border-gray-300 bg-white text-sm font-bold px-6 py-2.5 hover:border-black transition disabled:opacity-50 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-red-600 text-white text-sm font-bold px-6 py-2.5 hover:bg-red-700 transition disabled:opacity-50 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    published: "bg-green-100 text-green-800",
    draft: "bg-gray-200 text-gray-700",
    archived: "bg-amber-100 text-amber-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="text-center py-12 px-6 border border-dashed border-gray-300 rounded-2xl bg-white">
      <p className="font-bold text-[#191817]">{title}</p>
      {hint && <p className="text-[13px] text-gray-500 mt-1.5">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ConfirmDialog({ open, title, body, confirmLabel = "Delete", busy, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={busy ? undefined : onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <h3 className="font-extrabold text-[#191817]">{title}</h3>
        <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{body}</p>
        <div className="flex justify-end gap-2.5 mt-6">
          <GhostButton onClick={onCancel} disabled={busy}>Cancel</GhostButton>
          <DangerButton onClick={onConfirm} disabled={busy}>{busy ? "Working…" : confirmLabel}</DangerButton>
        </div>
      </div>
    </div>
  );
}

// Minimal toast stack (no extra dependency).
let toastId = 0;
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), 4000));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]);
  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }
  function push(message, kind = "ok") {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, kind }]);
  }
  const stack = (
    <div className="fixed bottom-4 right-4 z-[300] space-y-2 max-w-xs w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-xl px-4 py-3 text-[13px] font-semibold shadow-xl border ${
            t.kind === "error" ? "bg-red-600 text-white border-red-700" : "bg-[#191817] text-white border-black"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
  return { push, stack };
}
