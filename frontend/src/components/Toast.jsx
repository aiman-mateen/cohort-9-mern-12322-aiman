import { CheckCircle2, XCircle, X } from "lucide-react";

const Toast = ({ type = "success", message, onClose }) => {
  const isError = type === "error";

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-icon">
        {isError ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
      </div>

      <span className="toast-message">{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;