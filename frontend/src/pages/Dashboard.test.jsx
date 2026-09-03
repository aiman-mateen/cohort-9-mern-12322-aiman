import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { getNotes } from "../services/noteService";

jest.mock("../services/noteService", () => ({
  getNotes: jest.fn(),
  createNote: jest.fn(),
  deleteNote: jest.fn(),
  updateNote: jest.fn(),
  shareNote: jest.fn(),
  getSharedNotes: jest.fn(),
}));

jest.mock("../components/Sidebar", () => () => (
  <div data-testid="sidebar">Sidebar</div>
));

jest.mock("../components/Topbar", () => () => (
  <div data-testid="topbar">Topbar</div>
));

jest.mock("../components/NoteCard", () => ({ title }) => (
  <div data-testid="note-card">{title}</div>
));
jest.mock("../components/NewNoteModal", () => () => (
  <div data-testid="new-note-modal">New Note Modal</div>
));

jest.mock("../components/DeleteConfirmModal", () => () => (
  <div data-testid="delete-confirm-modal">Delete Confirm Modal</div>
));

jest.mock("../components/NoteCardSkeleton", () => () => (
  <div data-testid="note-card-skeleton">Loading...</div>
));

jest.mock("../components/ShareNoteModal", () => () => (
  <div data-testid="share-note-modal">Share Note Modal</div>
));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    localStorage.setItem(
      "token",
      "test-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Test User",
        email: "test@example.com",
      })
    );
  });

  test("fetches and displays user notes", async () => {
    getNotes.mockResolvedValue([
      {
        _id: "1",
        title: "My First Note",
        content: "This is my first note.",
        category: "personal",
        isFavorite: false,
        createdAt: "2026-08-29T10:00:00.000Z",
      },
      {
        _id: "2",
        title: "Important Work",
        content: "Work notes",
        category: "work",
        isFavorite: true,
        createdAt: "2026-08-29T09:00:00.000Z",
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );

    expect(getNotes).toHaveBeenCalledWith("test-token");

    await waitFor(() => {
      expect(
        screen.getByText("My First Note")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Important Work")
      ).toBeInTheDocument();
    });
  });
});