const NoteCardSkeleton = () => {
  return (
    <div className="note-card skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton-category"></div>

      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text short"></div>
      </div>

      <div className="skeleton-footer">
        <div className="skeleton-line skeleton-date"></div>
      </div>
    </div>
  );
};

export default NoteCardSkeleton;