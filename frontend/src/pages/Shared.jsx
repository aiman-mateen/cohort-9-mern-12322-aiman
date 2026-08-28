import "../App.css";

import { Users, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NoteCard from "../components/NoteCard";

import { getSharedNotes } from "../services/noteService";

const Shared = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedNotes, setSharedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newValue = !prev;

      localStorage.setItem(
        "theme",
        newValue ? "dark" : "light"
      );

      document.documentElement.setAttribute(
        "data-theme",
        newValue ? "dark" : "light"
      );

      return newValue;
    });
  };

  useEffect(() => {
    const fetchSharedNotes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const data = await getSharedNotes(token);

        console.log(
          "SHARED NOTES FOR CURRENT USER:",
          data
        );

        setSharedNotes(data);
      } catch (error) {
        console.error(
          "Failed to fetch shared notes:",
          error
        );
      }
    };

    fetchSharedNotes();
  }, []);

  const handleOpenNote = (note) => {
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  const filteredSharedNotes = sharedNotes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />

        {selectedNote ? (
          /* =========================
             OPENED SHARED NOTE
             ========================= */
          <section className="opened-note-view">

            <button
              type="button"
              className="back-to-dashboard"
              onClick={handleBack}
            >
              <ArrowLeft size={15} />
              Back to Shared
            </button>

            <div className="opened-note-header">
              <div className="opened-note-heading">
                <span className="note-category">
                  {selectedNote.category || "Personal"}
                </span>

                <h2>{selectedNote.title}</h2>
              </div>
            </div>

            <div className="opened-note-meta">
              <span>
                Created at:{" "}
                {new Date(
                  selectedNote.createdAt
                ).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>

              <span>
                Updated at:{" "}
                {new Date(
                  selectedNote.updatedAt
                ).getTime() >
                new Date(
                  selectedNote.createdAt
                ).getTime()
                  ? new Date(
                      selectedNote.updatedAt
                    ).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Not edited yet"}
              </span>
            </div>

            <div className="opened-note-content">
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

          </section>
        ) : (
          /* =========================
             SHARED NOTES LIST
             ========================= */
          <section className="dashboard">

            <div className="dashboard-header">
              <div>
                <p className="dashboard-eyebrow">
                  Workspace
                </p>

                <h1>Shared</h1>

                <p className="dashboard-subtitle">
                  Notes shared with you will appear here.
                </p>
              </div>
            </div>

            {filteredSharedNotes.length === 0 ? (
              <div className="shared-empty-state">
                <div className="shared-empty-icon">
                  <Users size={32} />
                </div>

                <h3>No shared notes yet</h3>

                <p>
                  Notes that are shared with you will appear here.
                </p>

                <span>
                  You don't have any shared notes at the moment.
                </span>
              </div>
            ) : (
              <div className="notes-grid">
                {filteredSharedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    content={note.content}
                    date={new Date(
                      note.createdAt
                    ).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    category={note.category || "Personal"}
                    isFavorite={note.isFavorite}
                    image={note.image}
                    onOpen={() =>
                      handleOpenNote(note)
                    }
                    readOnly={true}
                  />
                ))}
              </div>
            )}

          </section>
        )}
      </main>
    </div>
  );
};

export default Shared;