import { registerUser, loginUser } from "./authService";

describe("authService", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        test("registers a user successfully", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            const responseData = {
                message: "User registered successfully",
                user: {
                    name: "Test User",
                    email: "test@example.com",
                },
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => responseData,
            });

            const result = await registerUser(userData);

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );

            expect(result).toEqual(responseData);
        });

        test("throws the server error message when registration fails", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({
                    message: "Email already exists",
                }),
            });

            await expect(
                registerUser({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                })
            ).rejects.toThrow("Email already exists");
        });

        test("throws the default registration error when server provides no message", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });

            await expect(
                registerUser({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                })
            ).rejects.toThrow("Registration failed");
        });
    });

    describe("loginUser", () => {
        test("logs in a user successfully", async () => {
            const credentials = {
                email: "test@example.com",
                password: "password123",
            };

            const responseData = {
                message: "Login successful",
                token: "test-token",
                user: {
                    name: "Test User",
                    email: "test@example.com",
                },
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => responseData,
            });

            const result = await loginUser(credentials);

            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            expect(result).toEqual(responseData);
        });

        test("throws the server error message when login fails", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({
                    message: "Invalid email or password",
                }),
            });

            await expect(
                loginUser({
                    email: "test@example.com",
                    password: "wrongpassword",
                })
            ).rejects.toThrow("Invalid email or password");
        });

        test("throws the default login error when server provides no message", async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });

            await expect(
                loginUser({
                    email: "test@example.com",
                    password: "wrongpassword",
                })
            ).rejects.toThrow("Login failed");
        });
    });
});