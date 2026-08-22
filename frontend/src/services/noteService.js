const API_URL = "http://localhost:5000/api/notes";

export const getNotes = async (token) => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notes");
  }

  return data.notes;
};

export const createNote = async (noteData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create note");
  }

  return data.note;
};

export const deleteNote = async (noteId, token) => {
  const response = await fetch(`${API_URL}/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete note");
  }

  return data;
};

export const updateNote = async (noteId, noteData, token) => {
  const response = await fetch(`${API_URL}/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update note");
  }

  return data.note;
};