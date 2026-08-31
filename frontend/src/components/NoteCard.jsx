import { Pencil, Trash2, Heart } from "lucide-react";

const NoteCard = ({
  title,
  content,
  date,
  category = "Personal",
  isFavorite,
  image,
  onDelete,
  onEdit,
  onOpen,
  onFavorite,
  readOnly = false,
}) => {
  return (
    <article className="note-card" onClick={onOpen}>
      <div className="note-card-top">
        <span className="note-category">{category}</span>

        {!readOnly && (
          <button
            className={`favorite-button ${
              isFavorite ? "favorite-active" : ""
            }`}
            aria-label={
              isFavorite
                ? `Remove ${title} from favorites`
                : `Add ${title} to favorites`
            }
            title={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            onClick={(event) => {
              event.stopPropagation();
              onFavorite();
            }}
          >
            <Heart
              size={17}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      <div className="note-card-content">
        <h3>{title}</h3>

        <div
          className="note-card-preview"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="note-card-footer">
        <span>{date}</span>

        {!readOnly && (
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
        )}
      </div>
    </article>
  );
};

export default NoteCard;