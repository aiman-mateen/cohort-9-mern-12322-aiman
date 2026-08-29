import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Shared from "./Shared";

import { getSharedNotes } from "../services/noteService";

jest.mock("../services/noteService", () => ({
getSharedNotes: jest.fn(),
}));

jest.mock("../components/Sidebar", () => ({
__esModule: true,
default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock("../components/Topbar", () => ({
__esModule: true,
default: ({ searchQuery, onSearchChange, darkMode, onToggleTheme }) => (
<div data-testid="topbar">
<input
aria-label="Search"
value={searchQuery}
onChange={(e) => onSearchChange(e.target.value)}
/>

  <span data-testid="dark-mode-state">
    {darkMode ? "dark" : "light"}
  </span>

  <button type="button" onClick={onToggleTheme}>
    Toggle Theme
  </button>
</div>

),
}));

jest.mock("../components/NoteCard", () => ({
__esModule: true,
default: ({ title, content, category, onOpen }) => (
<div data-testid="note-card">
<h3>{title}</h3>
<p>{content}</p>
<span>{category}</span>

  <button type="button" onClick={onOpen}>
    Open Note
  </button>
</div>

),
}));

const sharedNotes = [
{
_id: "1",
title: "Shared Meeting Notes",
content: "Important meeting discussion",
category: "Work",
createdAt: "2026-08-20T10:00:00.000Z",
updatedAt: "2026-08-20T10:00:00.000Z",
isFavorite: false,
image: null,
},
{
_id: "2",
title: "Project Ideas",
content: "Ideas for the project",
category: "Ideas",
createdAt: "2026-08-21T10:00:00.000Z",
updatedAt: "2026-08-22T10:00:00.000Z",
isFavorite: true,
image: null,
},
];

const renderShared = () => {
return render(<Shared />);
};

describe("Shared Page", () => {
beforeEach(() => {
jest.clearAllMocks();
localStorage.clear();
document.documentElement.removeAttribute("data-theme");

getSharedNotes.mockResolvedValue([]);

});

test("renders the Shared page", async () => {
localStorage.setItem("token", "test-token");

renderShared();

expect(screen.getByTestId("sidebar")).toBeInTheDocument();
expect(screen.getByTestId("topbar")).toBeInTheDocument();

expect(
  screen.getByRole("heading", { name: "Shared" })
).toBeInTheDocument();

expect(
  screen.getByText("Notes shared with you will appear here.")
).toBeInTheDocument();

await waitFor(() => {
  expect(getSharedNotes).toHaveBeenCalledWith("test-token");
});

});

test("shows empty state when there are no shared notes", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue([]);

renderShared();

expect(
  await screen.findByText("No shared notes yet")
).toBeInTheDocument();

expect(
  screen.getByText("Notes that are shared with you will appear here.")
).toBeInTheDocument();

});

test("fetches shared notes when a token exists", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue(sharedNotes);

renderShared();

await waitFor(() => {
  expect(getSharedNotes).toHaveBeenCalledTimes(1);
  expect(getSharedNotes).toHaveBeenCalledWith("test-token");
});

});

test("displays fetched shared notes", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue(sharedNotes);

renderShared();

expect(
  await screen.findByText("Shared Meeting Notes")
).toBeInTheDocument();

expect(
  screen.getByText("Project Ideas")
).toBeInTheDocument();

expect(
  screen.getAllByTestId("note-card")
).toHaveLength(2);

});

test("filters shared notes using the search box", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue(sharedNotes);

renderShared();

expect(
  await screen.findByText("Shared Meeting Notes")
).toBeInTheDocument();

const searchInput = screen.getByRole("textbox", {
  name: "Search",
});

fireEvent.change(searchInput, {
  target: { value: "project" },
});

expect(
  screen.getByText("Project Ideas")
).toBeInTheDocument();

expect(
  screen.queryByText("Shared Meeting Notes")
).not.toBeInTheDocument();

});

test("opens a shared note when Open Note is clicked", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue(sharedNotes);

renderShared();

expect(
  await screen.findByText("Shared Meeting Notes")
).toBeInTheDocument();

const openButtons = screen.getAllByRole("button", {
  name: "Open Note",
});

fireEvent.click(openButtons[0]);

expect(
  screen.getByRole("heading", {
    name: "Shared Meeting Notes",
  })
).toBeInTheDocument();

expect(
  screen.getByRole("button", {
    name: "Back to Shared",
  })
).toBeInTheDocument();

expect(
  screen.getByText(/Created at:/)
).toBeInTheDocument();

expect(
  screen.getByText(/Updated at:/)
).toBeInTheDocument();

expect(
  screen.getByText("Important meeting discussion")
).toBeInTheDocument();

});

test("goes back to the shared notes list", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue(sharedNotes);

renderShared();

expect(
  await screen.findByText("Shared Meeting Notes")
).toBeInTheDocument();

fireEvent.click(
  screen.getAllByRole("button", {
    name: "Open Note",
  })[0]
);

expect(
  screen.getByRole("heading", {
    name: "Shared Meeting Notes",
  })
).toBeInTheDocument();

fireEvent.click(
  screen.getByRole("button", {
    name: "Back to Shared",
  })
);

expect(
  screen.getByRole("heading", {
    name: "Shared",
  })
).toBeInTheDocument();

expect(
  screen.getByText("Shared Meeting Notes")
).toBeInTheDocument();

});

test("toggles between light and dark mode", async () => {
localStorage.setItem("token", "test-token");

getSharedNotes.mockResolvedValue([]);

renderShared();

expect(document.documentElement).toHaveAttribute(
  "data-theme",
  "light"
);

expect(localStorage.getItem("theme")).toBe("light");

fireEvent.click(
  screen.getByRole("button", {
    name: "Toggle Theme",
  })
);

expect(document.documentElement).toHaveAttribute(
  "data-theme",
  "dark"
);

expect(localStorage.getItem("theme")).toBe("dark");

fireEvent.click(
  screen.getByRole("button", {
    name: "Toggle Theme",
  })
);

expect(document.documentElement).toHaveAttribute(
  "data-theme",
  "light"
);

expect(localStorage.getItem("theme")).toBe("light");

await waitFor(() => {
  expect(
    screen.getByTestId("dark-mode-state")
  ).toHaveTextContent("light");
});

});

test("does not fetch shared notes when there is no token", async () => {
renderShared();

await waitFor(() => {
  expect(getSharedNotes).not.toHaveBeenCalled();
});

expect(
  screen.getByText("No shared notes yet")
).toBeInTheDocument();

});
});