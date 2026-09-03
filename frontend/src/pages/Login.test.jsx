import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { loginUser } from "../services/authService";

jest.mock("../services/authService", () => ({
  loginUser: jest.fn(),
}));
describe("Login Page", () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });
  test("renders the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password", { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});

test("shows and hides the password when the toggle button is clicked", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const passwordInput = screen.getByLabelText("Password", { exact: true });
  const toggleButton = screen.getByRole("button", {
    name: "Show password",
  });

  expect(passwordInput).toHaveAttribute("type", "password");

  await user.click(toggleButton);

  expect(passwordInput).toHaveAttribute("type", "text");

  expect(
    screen.getByRole("button", { name: "Hide password" })
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Hide password" })
  );

  expect(passwordInput).toHaveAttribute("type", "password");
});

test("allows the user to enter email and password", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText("Password", { exact: true });

  await user.type(emailInput, "test@example.com");
  await user.type(passwordInput, "password123");

  expect(emailInput).toHaveValue("test@example.com");
  expect(passwordInput).toHaveValue("password123");
});

test("logs in successfully and stores token and user", async () => {
  const user = userEvent.setup();

  const mockUser = {
    id: "123",
    name: "Test User",
    email: "test@example.com",
  };

  loginUser.mockResolvedValue({
    token: "fake-jwt-token",
    user: mockUser,
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText(/email address/i),
    "test@example.com"
  );

  await user.type(
    screen.getByLabelText("Password", { exact: true }),
    "password123"
  );

  await user.click(
    screen.getByRole("button", { name: /sign in/i })
  );

  expect(loginUser).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });

  expect(localStorage.getItem("token")).toBe("fake-jwt-token");

  expect(JSON.parse(localStorage.getItem("user"))).toEqual(mockUser);
});

test("displays an error when login fails", async () => {
  const user = userEvent.setup();

  loginUser.mockRejectedValue(
    new Error("Invalid email or password")
  );

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText(/email address/i),
    "wrong@example.com"
  );

  await user.type(
    screen.getByLabelText("Password", { exact: true }),
    "wrongpassword"
  );

  await user.click(
    screen.getByRole("button", { name: /sign in/i })
  );

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Invalid email or password");

  expect(loginUser).toHaveBeenCalledWith({
    email: "wrong@example.com",
    password: "wrongpassword",
  });
});