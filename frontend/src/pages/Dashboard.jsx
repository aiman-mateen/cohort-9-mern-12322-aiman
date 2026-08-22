import "../App.css";
import { Plus, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NoteCard from "../components/NoteCard";
import Toast from "../components/Toast";
import { useEffect, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../services/noteService";
import NewNoteModal from "../components/NewNoteModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import NoteCardSkeleton from "../components/NoteCardSkeleton";



function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [toast, setToast] = useState(null);
    
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
      console.log("Fetched notes:", data);
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
      <Sidebar />

      <main className="main-content">
        <Topbar />

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

            <div className="opened-note-content">
              <p>{selectedNote.content}</p>
            </div>

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

                      <span className="other-note-preview">
                        {note.content}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </section>
        ) : (
          <>
           <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Your workspace</p>

            <h1>Good afternoon, Aiman 👋</h1>

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
            <button className="note-tab active">Home</button>
            <button className="note-tab">To-Do</button>
            <button className="note-tab">Drafts</button>
            <button className="note-tab">Reminders</button>
          </div>

          <button className="sort-button">
          <ArrowUpDown size={15} />
            Sort by
          </button>
        </div>
          <section className="notes-section">
            <div className="notes-section-header">
              <h2>Your Notes</h2>
              <span className="notes-count">{notes.length} notes</span>
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
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    content={note.content}
                    date={new Date(note.createdAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    category={note.category || "Personal"}
                    onDelete={() => handleDeleteNote(note._id)}
                    onEdit={() => handleEditNote(note)}
                    onOpen={() => handleOpenNote(note)}
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