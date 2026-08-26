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

export const createNote = async (noteData, token) => {
  const data = await request(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
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

export const updateNote = async (noteId, noteData, token) => {
  const data = await request(`${API_URL}/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  return data.note;
};