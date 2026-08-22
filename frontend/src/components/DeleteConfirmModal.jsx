import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="confirm-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon">
          <AlertTriangle size={20} />
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="confirm-content">
          <h2>Delete this note?</h2>
          <p>
            This action can't be undone. The note will be permanently
            removed from your workspace.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;