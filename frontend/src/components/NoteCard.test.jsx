import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "./NoteCard";

describe("NoteCard", () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnOpen = jest.fn();
  const mockOnFavorite = jest.fn();

  const defaultProps = {
    title: "My Test Note",
    content: "<p>This is my note content.</p>",
    date: "August 29, 2026",
    category: "Personal",
    isFavorite: false,
    image: null,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    onOpen: mockOnOpen,
    onFavorite: mockOnFavorite,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders note title, content, date, and category", () => {
    render(<NoteCard {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "My Test Note" })
    ).toBeInTheDocument();

    expect(screen.getByText("This is my note content.")).toBeInTheDocument();

    expect(screen.getByText("August 29, 2026")).toBeInTheDocument();

    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  test("uses Personal as the default category", () => {
    render(
      <NoteCard
        {...defaultProps}
        category={undefined}
      />
    );

    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  test("renders a custom category", () => {
    render(
      <NoteCard
        {...defaultProps}
        category="Work"
      />
    );

    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  test("calls onOpen when the note card is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const card = screen.getByRole("article");

    fireEvent.click(card);

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("calls onFavorite when favorite button is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const favoriteButton = screen.getByRole("button", {
      name: "Add My Test Note to favorites",
    });

    fireEvent.click(favoriteButton);

    expect(mockOnFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnOpen).not.toHaveBeenCalled();
  });

  test("shows Remove from favorites when note is already favorite", () => {
    render(
      <NoteCard
        {...defaultProps}
        isFavorite={true}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Remove My Test Note from favorites",
      })
    ).toBeInTheDocument();
  });

  test("calls onEdit when edit button is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const editButton = screen.getByRole("button", {
      name: "Edit My Test Note",
    });

    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnOpen).not.toHaveBeenCalled();
  });

  test("calls onDelete when delete button is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete My Test Note",
    });

    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnOpen).not.toHaveBeenCalled();
  });

  test("renders action buttons when readOnly is false", () => {
    render(
      <NoteCard
        {...defaultProps}
        readOnly={false}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Add My Test Note to favorites",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Edit My Test Note",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete My Test Note",
      })
    ).toBeInTheDocument();
  });

  test("hides action buttons in readOnly mode", () => {
    render(
      <NoteCard
        {...defaultProps}
        readOnly={true}
      />
    );

    expect(
      screen.queryByRole("button", {
        name: "Add My Test Note to favorites",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Edit My Test Note",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Delete My Test Note",
      })
    ).not.toBeInTheDocument();
  });

  test("still opens the note in readOnly mode", () => {
    render(
      <NoteCard
        {...defaultProps}
        readOnly={true}
      />
    );

    fireEvent.click(screen.getByRole("article"));

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("renders HTML content correctly", () => {
    render(
      <NoteCard
        {...defaultProps}
        content="<p><strong>Important</strong> content</p>"
      />
    );

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  test("favorite button has active styling when note is favorite", () => {
    render(
      <NoteCard
        {...defaultProps}
        isFavorite={true}
      />
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Remove My Test Note from favorites",
    });

    expect(favoriteButton).toHaveClass("favorite-active");
  });
});