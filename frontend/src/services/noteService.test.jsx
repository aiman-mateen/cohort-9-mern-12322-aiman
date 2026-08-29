import {
    ApiError,
    getNotes,
    createNote,
    deleteNote,
    updateNote,
    shareNote,
    getSharedNotes,
} from "./noteService";

describe("noteService", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        localStorage.clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("ApiError", () => {
        test("creates an ApiError with the correct properties", () => {
            const error = new ApiError("Test error", {
                status: 401,
                isNetworkError: false,
            });

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ApiError);
            expect(error.name).toBe("ApiError");
            expect(error.message).toBe("Test error");
            expect(error.status).toBe(401);
            expect(error.isNetworkError).toBe(false);
        });

        test("uses default ApiError values", () => {
            const error = new ApiError("Test error");

            expect(error.status).toBeNull();
            expect(error.isNetworkError).toBe(false);
        });
    });

    describe("getNotes", () => {
        test("fetches notes successfully with the provided token", async () => {
            const notes = [
                { _id: "1", title: "Note 1" },
                { _id: "2", title: "Note 2" },
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ notes }),
            });

            const result = await getNotes("test-token");

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes",
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer test-token",
                    },
                }
            );

            expect(result).toEqual(notes);
        });
    });

    describe("createNote", () => {
        test("creates a note using the token stored in localStorage", async () => {
            localStorage.setItem("token", "stored-token");

            const noteData = new FormData();
            noteData.append("title", "Test Note");

            const note = {
                _id: "123",
                title: "Test Note",
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ note }),
            });

            const result = await createNote(noteData);

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer stored-token",
                    },
                    body: noteData,
                }
            );

            expect(result).toEqual(note);
        });
    });

    describe("deleteNote", () => {
        test("deletes a note successfully", async () => {
            const responseData = {
                message: "Note deleted successfully",
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => responseData,
            });

            const result = await deleteNote("123", "delete-token");

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes/123",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer delete-token",
                    },
                }
            );

            expect(result).toEqual(responseData);
        });
    });

    describe("updateNote", () => {
        test("updates a note using JSON data", async () => {
            localStorage.setItem("token", "update-token");

            const noteData = {
                title: "Updated Note",
                content: "Updated content",
            };

            const updatedNote = {
                _id: "123",
                ...noteData,
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ note: updatedNote }),
            });

            const result = await updateNote("123", noteData);

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes/123",
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer update-token",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(noteData),
                }
            );

            expect(result).toEqual(updatedNote);
        });

        test("updates a note using FormData without setting Content-Type manually", async () => {
            localStorage.setItem("token", "form-token");

            const formData = new FormData();
            formData.append("title", "Updated with image");

            const updatedNote = {
                _id: "123",
                title: "Updated with image",
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ note: updatedNote }),
            });

            const result = await updateNote("123", formData);

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes/123",
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer form-token",
                    },
                    body: formData,
                }
            );

            expect(result).toEqual(updatedNote);
        });
    });

    describe("shareNote", () => {
        test("shares a note successfully", async () => {
            localStorage.setItem("token", "share-token");

            const responseData = {
                message: "Note shared successfully",
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => responseData,
            });

            const result = await shareNote("123", "friend@example.com");

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes/123/share",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer share-token",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: "friend@example.com",
                    }),
                }
            );

            expect(result).toEqual(responseData);
        });
    });

    describe("getSharedNotes", () => {
        test("fetches shared notes using the stored token", async () => {
            localStorage.setItem("token", "shared-token");

            const notes = [
                { _id: "1", title: "Shared Note 1" },
                { _id: "2", title: "Shared Note 2" },
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ notes }),
            });

            const result = await getSharedNotes();

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/notes/shared",
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer shared-token",
                    },
                }
            );

            expect(result).toEqual(notes);
        });
    });

    describe("error handling", () => {
        test("throws ApiError when fetch fails because of a network error", async () => {
            fetch.mockRejectedValueOnce(new Error("Network failure"));

            await expect(getNotes("test-token")).rejects.toMatchObject({
                name: "ApiError",
                message:
                    "Unable to reach the server. Check your internet connection and try again.",
                status: null,
                isNetworkError: true,
            });
        });

        test("uses the server-provided error message", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    message: "Invalid note data",
                }),
            });

            await expect(
                getNotes("test-token")
            ).rejects.toMatchObject({
                name: "ApiError",
                message: "Invalid note data",
                status: 400,
                isNetworkError: false,
            });
        });

        test("uses the session-expired message for a 401 response", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({}),
            });

            await expect(
                getNotes("expired-token")
            ).rejects.toMatchObject({
                name: "ApiError",
                message: "Your session has expired. Please log in again.",
                status: 401,
            });
        });

        test("uses the server error message for a 500 response", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({}),
            });

            await expect(
                getNotes("test-token")
            ).rejects.toMatchObject({
                name: "ApiError",
                message:
                    "Something went wrong on our end. Please try again shortly.",
                status: 500,
            });
        });

        test("uses the generic error message for other failed responses", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({}),
            });

            await expect(
                getNotes("test-token")
            ).rejects.toMatchObject({
                name: "ApiError",
                message: "Something went wrong. Please try again.",
                status: 404,
            });
        });

        test("handles a non-JSON error response", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => {
                    throw new Error("Invalid JSON");
                },
            });

            await expect(
                getNotes("test-token")
            ).rejects.toMatchObject({
                name: "ApiError",
                message:
                    "Something went wrong on our end. Please try again shortly.",
                status: 500,
            });
        });
    });
});