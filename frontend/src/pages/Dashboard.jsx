import "../App.css";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUpDown, Pencil, Trash2, Heart, Share2} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NoteCard from "../components/NoteCard";
import Toast from "../components/Toast";
import { useEffect, useRef, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote, shareNote} from "../services/noteService";
import NewNoteModal from "../components/NewNoteModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import NoteCardSkeleton from "../components/NoteCardSkeleton";
import ShareNoteModal from "../components/ShareNoteModal";


const OpenedNoteView = ({
  selectedNote,
  notes,
  openedNoteContentRef,
  onBack,
  onFavorite,
  onShare,
  onEdit,
  onDelete,
  onOpenNote,
}) => {
  const updatedAt = new Date(selectedNote.updatedAt).getTime();
  const createdAt = new Date(selectedNote.createdAt).getTime();

  return (
    <section className="opened-note-view">
      <button
        type="button"
        className="back-to-dashboard"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>

      <div className="opened-note-header">
        <div className="opened-note-heading">
          <span className="note-category">
            {selectedNote.category || "Personal"}
          </span>
          <h2>{selectedNote.title}</h2>
        </div>

        <div className="opened-note-actions">
          <button
            type="button"
            className={`favorite-note-button ${
              selectedNote.isFavorite ? "favorite-active" : ""
            }`}
            onClick={() => onFavorite(selectedNote)}
          >
            <Heart
              size={15}
              fill={selectedNote.isFavorite ? "currentColor" : "none"}
            />
            {selectedNote.isFavorite ? "Favorited" : "Favorite"}
          </button>

          <button
            type="button"
            className="note-share-button"
            onClick={onShare}
          >
            <Share2 size={15} />
            Share
          </button>

          <button
            type="button"
            className="note-edit-button"
            onClick={() => onEdit(selectedNote)}
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={() => onDelete(selectedNote._id)}
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      <div className="opened-note-meta">
        <span>
          Created at:{" "}
          {new Date(selectedNote.createdAt).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>

        <span>
          Updated at:{" "}
          {updatedAt > createdAt
            ? new Date(selectedNote.updatedAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Not edited yet"}
        </span>
      </div>

      <div
        ref={openedNoteContentRef}
        className="opened-note-content"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: selectedNote.content,
          }}
        />

        {selectedNote.image && (
          <div className="opened-note-image">
            <img
              src={`http://localhost:5000${selectedNote.image}`}
              alt={selectedNote.title}
            />
          </div>
        )}
      </div>

      <div className="other-notes-section">
        <div className="notes-section-header">
          <h2>Other Notes</h2>
          <span className="notes-count">
            {notes.filter(
              (note) => note._id !== selectedNote._id
            ).length}{" "}
            notes
          </span>
        </div>

        <div className="other-notes-list">
          {notes
            .filter((note) => note._id !== selectedNote._id)
            .map((note) => (
              <button
                key={note._id}
                type="button"
                className="other-note-item"
                onClick={() => onOpenNote(note)}
              >
                <span className="other-note-title">
                  {note.title}
                </span>

                <span
                  className="other-note-preview"
                  dangerouslySetInnerHTML={{
                    __html: note.content,
                  }}
                />
              </button>
            ))}
        </div>
      </div>
    </section>
  );
};

const NotesToolbar = ({
  activeTab,
  setActiveTab,
  navigate,
  isSortOpen,
  setIsSortOpen,
  sortOption,
  setSortOption,
  sortWrapperRef,
}) => {
  const handleTabChange = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  return (
    <>
      <div className="notes-toolbar">
        <div className="note-tabs">
          <button
            type="button"
            className={`note-tab ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleTabChange("dashboard", "/dashboard")}
          >
            Home
          </button>

          <button
            type="button"
            className={`note-tab ${
              activeTab === "favorites" ? "active" : ""
            }`}
            onClick={() =>
              handleTabChange("favorites", "/dashboard/favorites")
            }
          >
            Favorites
          </button>

          {["Personal", "Work", "Study", "Ideas", "To-Do", "Reminders"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                className={`note-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => handleTabChange(tab, "/dashboard")}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="sort-wrapper" ref={sortWrapperRef}>
          <button
            type="button"
            className="sort-button"
            onClick={() =>
              setIsSortOpen((current) => !current)
            }
          >
            <ArrowUpDown size={15} />
            Sort by
          </button>

          {isSortOpen && (
            <div className="sort-menu">
              <button
                type="button"
                className={
                  sortOption === "newest"
                    ? "sort-option active"
                    : "sort-option"
                }
                onClick={() => handleSortChange("newest")}
              >
                Newest first
              </button>

              <button
                type="button"
                className={
                  sortOption === "oldest"
                    ? "sort-option active"
                    : "sort-option"
                }
                onClick={() => handleSortChange("oldest")}
              >
                Oldest first
              </button>

              <button
                type="button"
                className={
                  sortOption === "a-z"
                    ? "sort-option active"
                    : "sort-option"
                }
                onClick={() => handleSortChange("a-z")}
              >
                A–Z
              </button>

              <button
                type="button"
                className={
                  sortOption === "z-a"
                    ? "sort-option active"
                    : "sort-option"
                }
                onClick={() => handleSortChange("z-a")}
              >
                Z–A
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const NotesSection = ({
  isLoading,
  error,
  notes,
  filteredNotes,
  sortedNotes,
  getEmptyNotesMessage,
  onDelete,
  onEdit,
  onOpen,
  onFavorite,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="notes-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <NoteCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="notes-state">
          <p>{error}</p>
        </div>
      );
    }

    if (notes.length === 0) {
      return (
        <div className="notes-state">
          <p>You don't have any notes yet.</p>
        </div>
      );
    }

    if (filteredNotes.length === 0) {
      return (
        <div className="notes-state">
          <p>{getEmptyNotesMessage()}</p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note._id}
            title={note.title}
            content={note.content}
            date={new Date(note.createdAt).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            category={note.category || "Personal"}
            isFavorite={note.isFavorite}
            onDelete={() => onDelete(note._id)}
            onEdit={() => onEdit(note)}
            onOpen={() => onOpen(note)}
            onFavorite={() => onFavorite(note)}
            image={note.image}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="notes-section">
      <div className="notes-section-header">
        <h2>Your Notes</h2>
        <span className="notes-count">
          {filteredNotes.length}{" "}
          {filteredNotes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {renderContent()}
    </section>
  );
};

function Dashboard() {
    // console.log("DASHBOARD IS RENDERING", location.pathname);
    // alert("Dashboard.jsx is running");
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    // const [sharedNotes, setSharedNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sortOption, setSortOption] = useState("newest");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortWrapperRef = useRef(null);
    const openedNoteContentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [toast, setToast] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
      localStorage.getItem("theme") === "dark"
    );

    

    const filteredNotes = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query);

   const matchesTab =
    activeTab === "dashboard" ||
    activeTab === "all" ||
    (activeTab === "favorites" && note.isFavorite) ||
    activeTab === note.category;

    return matchesSearch && matchesTab;
  });
    
      const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortOption === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortOption === "a-z") {
          return a.title.localeCompare(b.title);
        }

        if (sortOption === "z-a") {
          return b.title.localeCompare(a.title);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    

      useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          return;
        }

        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Invalid user data in localStorage:", error);
          localStorage.removeItem("user");
        }
      }, []);
    
      useEffect(() => {
      if (!toast) {
        return;
      }

      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }, [toast]);

 
    useEffect(() => {
      
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getNotes(token);
        setNotes(data);
        setError("");
        
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
  }, []);


  // useEffect(() => {
  //   if (!isSharedPage) {
  //     return;
  //   }

  //   const fetchSharedNotes = async () => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       setError("You are not logged in.");
  //       return;
  //     }

  //     try {
  //       const data = await getSharedNotes(token);
  //       console.log("shared notes from api:" , data)
  //       setSharedNotes(data);
  //       setError("");
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchSharedNotes();
  // }, [isSharedPage]);

useEffect(() => {
  document.documentElement.dataset.theme = darkMode ? "dark" : "light";

  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      sortWrapperRef.current &&
      !sortWrapperRef.current.contains(event.target)
    ) {
      setIsSortOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleCreateNote = async (noteData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You are not logged in.");
    return;
  }

  try {
    const newNote = await createNote(noteData, token);

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setError("");
    setToast({
      type: "success",
      message: "Note created successfully",
    });
        setIsModalOpen(false);
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
    }
};

const handleOpenNote = (note) => {
  setSelectedNote(note);
};

const handleEditNote = (note) => {
  setNoteToEdit(note);
  setIsModalOpen(true);
};

const handleFavoriteNote = async (note) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You are not logged in.");
    return;
  }

  const newFavoriteStatus = !note.isFavorite;

  try {
    const updatedNote = await updateNote(
      note._id,
      { isFavorite: newFavoriteStatus },
      token
    );

    setNotes((currentNotes) =>
      currentNotes.map((currentNote) =>
        currentNote._id === updatedNote._id
          ? updatedNote
          : currentNote
      )
    );

    setSelectedNote((currentNote) =>
      currentNote?._id === updatedNote._id
        ? updatedNote
        : currentNote
    );

    setToast({
      type: "success",
      message: updatedNote.isFavorite
        ? "Note added to favorites"
        : "Note removed from favorites",
    });
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
  }
};

const handleToggleTask = async (event) => {
  const checkbox = event.target.closest(
    '.opened-note-content input[type="checkbox"]'
  );

  if (!checkbox || !selectedNote) {
    return;
  }

  event.preventDefault();

  const taskItem = checkbox.closest('li[data-type="taskItem"]');

  if (!taskItem) {
    return;
  }

  const newCheckedState =
    taskItem.dataset.checked !== "true";

  const parser = new DOMParser();
  const doc = parser.parseFromString(
    selectedNote.content,
    "text/html"
  );

  const taskItems = doc.querySelectorAll(
    'li[data-type="taskItem"]'
  );

  const clickedTaskIndex = Array.from(
    openedNoteContentRef.current.querySelectorAll(
      'li[data-type="taskItem"]'
    )
  ).indexOf(taskItem);

  const savedTaskItem = taskItems[clickedTaskIndex];

  if (!savedTaskItem) {
    return;
  }

  savedTaskItem.dataset.checked = String(newCheckedState);

  const savedCheckbox = savedTaskItem.querySelector(
    'input[type="checkbox"]'
  );

  if (savedCheckbox) {
    savedCheckbox.checked = newCheckedState;

    if (newCheckedState) {
      savedCheckbox.setAttribute("checked", "checked");
    } else {
      savedCheckbox.removeAttribute("checked");
    }
  }

  const updatedContent = doc.body.innerHTML;
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You are not logged in.");
    return;
  }

  try {
    const updatedNote = await updateNote(
      selectedNote._id,
      {
        content: updatedContent,
      },
      token
    );

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );

    setSelectedNote(updatedNote);

    setToast({
      type: "success",
      message: newCheckedState
        ? "Task completed"
        : "Task marked as incomplete",
    });
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
  }
};

useEffect(() => {
  const element = openedNoteContentRef.current;

  if (!element) {
    return;
  }

  element.addEventListener("click", handleToggleTask);

  return () => {
    element.removeEventListener("click", handleToggleTask);
  };
}, [selectedNote, handleToggleTask]);

const handleUpdateNote = async (noteData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You are not logged in.");
    return;
  }

  try {
    const updatedNote = await updateNote(noteToEdit._id, noteData, token);

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
    setSelectedNote((currentNote) =>
      currentNote?._id === updatedNote._id ? updatedNote : currentNote
    );
    setError("");
    setToast({
      type: "success",
      message: "Note updated successfully",
    });

    setIsModalOpen(false);
    setNoteToEdit(null);
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
  }
};

const handleShareNote = async (email) => {
  if (!selectedNote) {
    return;
  }

  try {
    const data = await shareNote(selectedNote._id, email);

    setSelectedNote(data.note);

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note._id === data.note._id ? data.note : note
      )
    );

    setIsShareModalOpen(false);

    setToast({
      type: "success",
      message: "Note shared successfully",
    });
  } catch (error) {
    setToast({
      type: "error",
      message: error.message,
    });
  }
};

const handleDeleteNote = (noteId) => {
  setNoteToDelete(noteId);
  setIsDeleteModalOpen(true);
};

const confirmDeleteNote = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You are not logged in.");
    return;
  }

  try {
    await deleteNote(noteToDelete, token);

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note._id !== noteToDelete)
    );
    setSelectedNote((currentNote) =>
      currentNote?._id === noteToDelete ? null : currentNote
    );
    setError("");
    setToast({
      type: "error",
      message: "Note deleted successfully",
    });

    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  } catch (error) {
    setError(error.message);

    setToast({
      type: "error",
      message: error.message,
    });
  }
};

const getEmptyNotesMessage = () => {
  if (activeTab === "favorites") {
    if (searchQuery.trim()) {
      return `No favorite notes found for "${searchQuery}".`;
    }

    return "You don't have any favorite notes yet.";
  }

  if (activeTab !== "dashboard" && !searchQuery.trim()) {
    return `No ${activeTab} notes yet.`;
  }

  return `No notes found for "${searchQuery}".`;
};

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} darkMode={darkMode} onToggleTheme={()=> setDarkMode((prev) => !prev)} />

        {selectedNote ? (
  <OpenedNoteView
    selectedNote={selectedNote}
    notes={notes}
    openedNoteContentRef={openedNoteContentRef}
    onBack={() => setSelectedNote(null)}
    onFavorite={handleFavoriteNote}
    onShare={() => setIsShareModalOpen(true)}
    onEdit={handleEditNote}
    onDelete={handleDeleteNote}
    onOpenNote={handleOpenNote}
  />
) : (
  <>
    <section className="dashboard-header">
      <div>
        <p className="dashboard-eyebrow">Your workspace</p>
        <h1>Good afternoon, {user?.name || "there"} 👋</h1>
        <p className="dashboard-subtitle">
          Capture your thoughts and keep everything organized.
        </p>
      </div>

      <button
        type="button"
        className="new-note-button"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={16} />
        <span>New Note</span>
      </button>
    </section>

    <NotesToolbar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      navigate={navigate}
      isSortOpen={isSortOpen}
      setIsSortOpen={setIsSortOpen}
      sortOption={sortOption}
      setSortOption={setSortOption}
      sortWrapperRef={sortWrapperRef}
    />

    <NotesSection
      isLoading={isLoading}
      error={error}
      notes={notes}
      filteredNotes={filteredNotes}
      sortedNotes={sortedNotes}
      getEmptyNotesMessage={getEmptyNotesMessage}
      onDelete={handleDeleteNote}
      onEdit={handleEditNote}
      onOpen={handleOpenNote}
      onFavorite={handleFavoriteNote}
    />
  </>
)}
      </main>
      
      {isModalOpen && !noteToEdit &&(
        <NewNoteModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateNote}
        />
      )}

      {isModalOpen && noteToEdit && (
        <NewNoteModal
          note={noteToEdit}
          mode="edit"
          onClose={() => {
            setIsModalOpen(false);
            setNoteToEdit(null);
          }}
          onCreate={handleUpdateNote}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          onClose={() => {
            setIsDeleteModalOpen(false);
            setNoteToDelete(null);
          }}
          onConfirm={confirmDeleteNote}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {isShareModalOpen && selectedNote && (
        <ShareNoteModal
          note={selectedNote}
          onClose={() => setIsShareModalOpen(false)}
          onShare={handleShareNote}
        />
      )}

      
    </div>
  );
}

export default Dashboard;