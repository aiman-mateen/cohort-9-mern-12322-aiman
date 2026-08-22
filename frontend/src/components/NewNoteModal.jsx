import { X } from "lucide-react";
import { useEffect, useState } from "react";

const NewNoteModal = ({ onClose, onCreate, note = null, mode = "create" }) => {
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    useEffect(() => {
      setTitle(note?.title || "");
      setContent(note?.content || "");
    }, [note]);
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="note-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{mode === "edit" ? "Edit Note" : "New Note"}</h2>
            <p>
              {mode === "edit"
                ? "Make changes to your note."
                : "Capture something worth remembering."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note-title">Title</label>

            <input
              id="note-title"
              type="text"
              placeholder="Give your note a title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-content">Content</label>

            <textarea
              id="note-content"
              placeholder="Write your note here..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={7}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="modal-create">
              {mode === "edit" ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNoteModal;