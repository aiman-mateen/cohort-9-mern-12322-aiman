import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewNoteModal from "./NewNoteModal";

describe("NewNoteModal", () => {
const mockOnClose = jest.fn();
const mockOnCreate = jest.fn();

beforeEach(() => {
jest.clearAllMocks();

global.URL.createObjectURL = jest.fn(() => "blob:test-image-url");

});

test("renders New Note modal in create mode", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

expect(
  screen.getByRole("heading", { name: "New Note" })
).toBeInTheDocument();

expect(
  screen.getByText("Capture something worth remembering.")
).toBeInTheDocument();

expect(
  screen.getByLabelText("Title")
).toBeInTheDocument();

expect(
  screen.getByText("Personal")
).toBeInTheDocument();

expect(
  screen.getByRole("button", { name: "Create Note" })
).toBeInTheDocument();

expect(
  screen.getByRole("button", { name: "Cancel" })
).toBeInTheDocument();

});

test("closes the modal when Cancel is clicked", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

fireEvent.click(
  screen.getByRole("button", { name: "Cancel" })
);

expect(mockOnClose).toHaveBeenCalledTimes(1);

});

test("closes the modal when the close button is clicked", () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

fireEvent.click(
  screen.getByRole("button", { name: "Close" })
);

expect(mockOnClose).toHaveBeenCalledTimes(1);

});

test("shows validation errors when title and content are empty", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

fireEvent.click(
  screen.getByRole("button", { name: "Create Note" })
);

expect(
  await screen.findByText("Please enter a title.")
).toBeInTheDocument();

expect(
  screen.getByText("Please enter some content.")
).toBeInTheDocument();

expect(mockOnCreate).not.toHaveBeenCalled();

});

test("clears title validation error when title is entered", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

fireEvent.click(
  screen.getByRole("button", { name: "Create Note" })
);

expect(
  await screen.findByText("Please enter a title.")
).toBeInTheDocument();

const titleInput = screen.getByLabelText("Title");

fireEvent.change(titleInput, {
  target: { value: "My New Note" },
});

await waitFor(() => {
  expect(
    screen.queryByText("Please enter a title.")
  ).not.toBeInTheDocument();
});

});

test("opens category dropdown and changes category", () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

const categoryButton = screen.getByRole("button", {
  name: "Category",
});

fireEvent.click(categoryButton);

expect(
  screen.getByRole("listbox")
).toBeInTheDocument();

expect(
  screen.getByRole("option", { name: "Work" })
).toBeInTheDocument();

fireEvent.click(
  screen.getByRole("option", { name: "Work" })
);

expect(
  screen.getByRole("button", { name: "Category" })
).toBeInTheDocument("Work");

});

test("shows To-Do checklist toolbar button when To-Do category is selected", () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

fireEvent.click(
  screen.getByRole("button", { name: "Category" })
);

fireEvent.click(
  screen.getByRole("option", { name: "To-Do" })
);

expect(
  screen.getByRole("button", {
    name: "To-Do checklist",
  })
).toBeInTheDocument();

});

test("does not show To-Do checklist button for normal categories", () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

expect(
  screen.queryByRole("button", {
    name: "To-Do checklist",
  })
).not.toBeInTheDocument();

});

test("rejects unsupported image types", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

const imageInput = screen.getByLabelText("Image");

const invalidFile = new File(
  ["fake file"],
  "document.pdf",
  { type: "application/pdf" }
);

fireEvent.change(imageInput, {
  target: {
    files: [invalidFile],
  },
});

expect(
  await screen.findByText(
    "Only JPG, JPEG, PNG and WEBP images are allowed."
  )
).toBeInTheDocument();

});

test("rejects images larger than 2MB", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

const imageInput = screen.getByLabelText("Image");

const largeFile = new File(
  ["fake file"],
  "large-image.png",
  { type: "image/png" }
);

Object.defineProperty(largeFile, "size", {
  value: 3 * 1024 * 1024,
});

fireEvent.change(imageInput, {
  target: {
    files: [largeFile],
  },
});

expect(
  await screen.findByText(
    "Image size must be less than 2MB."
  )
).toBeInTheDocument();

});

test("accepts a valid image and shows image preview", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

const imageInput = screen.getByLabelText("Image");

const validFile = new File(
  ["fake image"],
  "photo.png",
  { type: "image/png" }
);

Object.defineProperty(validFile, "size", {
  value: 500 * 1024,
});

fireEvent.change(imageInput, {
  target: {
    files: [validFile],
  },
});

expect(
  await screen.findByAltText("Note preview")
).toBeInTheDocument();

expect(
  screen.getByRole("button", {
    name: /Remove Image/,
  })
).toBeInTheDocument();

expect(
  screen.getByText("Replace Image")
).toBeInTheDocument();

});

test("removes selected image preview", async () => {
render(
<NewNoteModal onClose={mockOnClose} onCreate={mockOnCreate} />
);

const imageInput = screen.getByLabelText("Image");

const validFile = new File(
  ["fake image"],
  "photo.png",
  { type: "image/png" }
);

Object.defineProperty(validFile, "size", {
  value: 500 * 1024,
});

fireEvent.change(imageInput, {
  target: {
    files: [validFile],
  },
});

expect(
  await screen.findByAltText("Note preview")
).toBeInTheDocument();

fireEvent.click(
  screen.getByRole("button", {
    name: /Remove Image/,
  })
);

expect(
  screen.queryByAltText("Note preview")
).not.toBeInTheDocument();

expect(
  screen.getByText("Add Image")
).toBeInTheDocument();

});

test("renders edit mode with existing note data", () => {
const note = {
title: "Existing Note",
content: "<p>Existing content</p>",
category: "Work",
image: "/uploads/existing.png",
};

render(
  <NewNoteModal
    onClose={mockOnClose}
    onCreate={mockOnCreate}
    note={note}
    mode="edit"
  />
);

expect(
  screen.getByRole("heading", { name: "Edit Note" })
).toBeInTheDocument();

expect(
  screen.getByText("Make changes to your note.")
).toBeInTheDocument();

expect(
  screen.getByDisplayValue("Existing Note")
).toBeInTheDocument();

expect(
  screen.getByRole("button", { name: "Category" })
).toBeInTheDocument("Work");

expect(
  screen.getByRole("button", { name: "Save Changes" })
).toBeInTheDocument();

expect(
  screen.getByAltText("Note preview")
).toBeInTheDocument();

});
});