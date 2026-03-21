import { useToast } from '../context/ToastContext';

const typeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-700',
};

const ToastViewport = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-fade-in-up rounded-xl border px-4 py-3 text-sm shadow-lg ${typeStyles[toast.type] || typeStyles.info}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded px-1 text-xs opacity-70 transition hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
