import { useState } from "react";

const ShareNoteModal = ({ note, onClose, onShare }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    onShare(email.trim());
  };

  return (
   <div className="modal-overlay">
  <div className="note-modal share-modal">
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Share note</p>
            <h2>Share "{note.title}"</h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="note-form">
            <label htmlFor="share-email">
              User's email address
            </label>

            <input
              id="share-email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="new-note-button"
            >
              Share Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareNoteModal;