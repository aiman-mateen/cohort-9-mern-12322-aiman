import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, ArrowUpDown, Pencil, Trash2, Heart, Users, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NoteCard from "../components/NoteCard";
import Toast from "../components/Toast";
import { useEffect, useRef, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../services/noteService";
import NewNoteModal from "../components/NewNoteModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import NoteCardSkeleton from "../components/NoteCardSkeleton";



function Dashboard() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const isSharedPage = currentPath === "/dashboard/shared";
    const isSettingsPage = currentPath === "/dashboard/settings"; 
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sortOption, setSortOption] = useState("newest");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortWrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [toast, setToast] = useState(null);
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

useEffect(() => {
  document.documentElement.setAttribute(
    "data-theme",
    darkMode ? "dark" : "light"
  );

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

  const newCheckedState = taskItem.getAttribute("data-checked") !== "true";

  const parser = new DOMParser();
  const doc = parser.parseFromString(selectedNote.content, "text/html");

  const taskItems = doc.querySelectorAll(
    'li[data-type="taskItem"]'
  );

  // Find which task was clicked
  const clickedTaskIndex = Array.from(
    event.currentTarget.querySelectorAll(
      'li[data-type="taskItem"]'
    )
  ).indexOf(taskItem);

  const savedTaskItem = taskItems[clickedTaskIndex];

  if (!savedTaskItem) {
    return;
  }

  savedTaskItem.setAttribute(
    "data-checked",
    String(newCheckedState)
  );

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

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} darkMode={darkMode} onToggleTheme={()=> setDarkMode((prev) => !prev)} />

        {selectedNote ? (
          <section className="opened-note-view">
            <button
              type="button"
              className="back-to-dashboard"
              onClick={() => setSelectedNote(null)}
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
                  onClick={() => handleFavoriteNote(selectedNote)}
                >
                  <Heart
                    size={15}
                    fill={selectedNote.isFavorite ? "currentColor" : "none"}
                  />
                  {selectedNote.isFavorite ? "Favorited" : "Favorite"}
                </button>

                <button
                  type="button"
                  className="note-edit-button"
                  onClick={() => handleEditNote(selectedNote)}
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={() => handleDeleteNote(selectedNote._id)}
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
                {new Date(selectedNote.updatedAt).getTime() >
                new Date(selectedNote.createdAt).getTime()
                  ? new Date(selectedNote.updatedAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Not edited yet"}
              </span>
            </div>

            <div
              className="opened-note-content"  onClick={handleToggleTask}
              dangerouslySetInnerHTML={{ __html: selectedNote.content }}
            />

            <div className="other-notes-section">
              <div className="notes-section-header">
                <h2>Other Notes</h2>
                <span className="notes-count">
                   {notes.filter((note) => note._id !== selectedNote._id).length} notes
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
                      onClick={() => handleOpenNote(note)}
                    >
                      <span className="other-note-title">{note.title}</span>

                      <span className="other-note-preview" dangerouslySetInnerHTML={{ __html: note.content }} />
            
                    </button>
                  ))}
              </div>
            </div>
          </section>
        ) : isSharedPage ? (
            <section className="placeholder-page">
              <div className="placeholder-page-content">
                <Users size={32} />
                <h1>Shared Notes</h1>
                <p>
                  Notes shared with you will appear here.
                </p>
              </div>
            </section>
          ) : isSettingsPage ? (
            <section className="placeholder-page">
              <div className="placeholder-page-content">
                <Settings size={32} />
                <h1>Settings</h1>
                <p>
                  Account and application settings will appear here.
                </p>
              </div>
            </section>
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
            className="new-note-button"
            onClick={() => setIsModalOpen(true)}
            >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </section>

        <div className="notes-toolbar">
          <div className="note-tabs">
            <button
            className={`note-tab ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              navigate("/dashboard");
            }}
          >
            Home
          </button>

            <button
              className={`note-tab ${
                activeTab === "favorites" ? "active" : ""
              }`}
              onClick={() => {setActiveTab("favorites"); navigate("/dashboard/favorites")}}
            >
              Favorites
            </button>

            <button
            className={`note-tab ${
              activeTab === "Personal" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Personal");
              navigate("/dashboard");
            }}
          >
            Personal
          </button>

            <button
            className={`note-tab ${
              activeTab === "Work" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Work");
              navigate("/dashboard");
            }}
          >
            Work
          </button>

            <button
              className={`note-tab ${
                activeTab === "Study" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("Study");
                navigate("/dashboard");
              }}
            >
              Study
            </button>

            <button
              className={`note-tab ${
                activeTab === "Ideas" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("Ideas");
                navigate("/dashboard");
              }}
            >
              Ideas
            </button>

            <button
              className={`note-tab ${
                activeTab === "To-Do" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("To-Do");
                navigate("/dashboard");
              }}
            >
              To-Do
            </button>

            <button
              className={`note-tab ${
                activeTab === "Reminders" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("Reminders");
                navigate("/dashboard");
              }}
            >
              Reminders
            </button>
          </div>

          <div className="sort-wrapper" ref={sortWrapperRef}>
          <button
            type="button"
            className="sort-button"
            onClick={() => setIsSortOpen((current) => !current)}
          >
            <ArrowUpDown size={15} />
            Sort by
          </button>

          {isSortOpen && (
            <div className="sort-menu">
              <button
                className={sortOption === "newest" ? "sort-option active" : "sort-option"}
                onClick={() => {
                  setSortOption("newest");
                  setIsSortOpen(false);
                }}
              >
                Newest first
              </button>

              <button
                className={sortOption === "oldest" ? "sort-option active" : "sort-option"}
                onClick={() => {
                  setSortOption("oldest");
                  setIsSortOpen(false);
                }}
              >
                Oldest first
              </button>

              <button
                className={sortOption === "a-z" ? "sort-option active" : "sort-option"}
                onClick={() => {
                  setSortOption("a-z");
                  setIsSortOpen(false);
                }}
              >
                A–Z
              </button>

              <button
                className={sortOption === "z-a" ? "sort-option active" : "sort-option"}
                onClick={() => {
                  setSortOption("z-a");
                  setIsSortOpen(false);
                }}
              >
                Z–A
              </button>
    </div>
  )}
</div>
        </div>
          <section className="notes-section">
            <div className="notes-section-header">
              <h2>Your Notes</h2>
              <span className="notes-count">
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
              </span>
            </div>
           
            {isLoading ? (
              <div className="notes-grid">
                {Array.from({ length: 3 }).map((_, index) => (
                  <NoteCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="notes-state">
                <p>{error}</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="notes-state">
                <p>You don't have any notes yet.</p>
              </div>
            ) : filteredNotes.length === 0 ? (
                <div className="notes-state">
                  {activeTab === "favorites" ? (
                    <p>
                      {searchQuery.trim()
                        ? `No favorite notes found for "${searchQuery}".`
                        : "You don't have any favorite notes yet."}
                    </p>
                  ) : activeTab !== "dashboard" && !searchQuery.trim() ? (
                    <p>No {activeTab} notes yet.</p>
                  ) : (
                    <p>No notes found for "{searchQuery}".</p>
                  )}
                </div>
              ) : (
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
                    onDelete={() => handleDeleteNote(note._id)}
                    onEdit={() => handleEditNote(note)}
                    onOpen={() => handleOpenNote(note)}
                    onFavorite={() => handleFavoriteNote(note)}
                  />
                ))}
              </div>
            )}          
          </section>
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

      
    </div>
  );
}

export default Dashboard;