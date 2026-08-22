import { Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ title, content, date, category = "Personal", onDelete, onEdit, onOpen}) => {
  return (
    <article className="note-card" onClick={onOpen}>
      <div className="note-card-top">
        <span className="note-category">{category}</span>
      </div>

      <div className="note-card-content">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>

        <div className="note-card-footer">
          <span>{date}</span>

          <div className="note-actions">
            <button
              aria-label={`Edit ${title}`}
              title="Edit note"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              <Pencil size={15} />
            </button>

            <button
              className="delete-button"
              aria-label={`Delete ${title}`}
              title="Delete note"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
    </article>
  );
};

export default NoteCard;