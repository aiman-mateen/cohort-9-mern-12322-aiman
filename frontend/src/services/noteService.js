const API_URL = "http://localhost:5000/api/notes";

// Custom error so callers can distinguish network failures,
// expired sessions (401), and generic server errors without
// parsing message strings.
export class ApiError extends Error {
  constructor(message, { status = null, isNetworkError = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

const request = async (url, options) => {
  let response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    // fetch() itself throws (not response.ok) when there's no
    // connectivity, the server is unreachable, CORS blocks it, etc.
    throw new ApiError(
      "Unable to reach the server. Check your internet connection and try again.",
      { isNetworkError: true }
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response wasn't valid JSON (e.g. server crashed and returned HTML/empty body)
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (response.status === 401
        ? "Your session has expired. Please log in again."
        : response.status >= 500
        ? "Something went wrong on our end. Please try again shortly."
        : "Something went wrong. Please try again.");

    throw new ApiError(message, { status: response.status });
  }

  return data;
};

export const getNotes = async (token) => {
  const data = await request(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.notes;
};

export const createNote = async (noteData) => {
  const token = localStorage.getItem("token");

  const data = await request(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: noteData,
  });

  return data.note;
};

export const deleteNote = async (noteId, token) => {
  const data = await request(`${API_URL}/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const updateNote = async (id, noteData) => {
  const token = localStorage.getItem("token");

  const isFormData = noteData instanceof FormData;

  const data = await request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
    },
    body: isFormData
      ? noteData
      : JSON.stringify(noteData),
  });

  return data.note;
};



export const shareNote = async (noteId, email) => {
  const token = localStorage.getItem("token");

  return await request(`${API_URL}/${noteId}/share`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
};

export const getSharedNotes = async () => {
  const token = localStorage.getItem("token");

  const data = await request(`${API_URL}/shared`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.notes;
};