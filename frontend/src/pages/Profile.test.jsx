import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../components/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock("../components/Topbar", () => ({
  __esModule: true,
  default: () => <div data-testid="topbar">Topbar</div>,
}));

jest.mock("../components/Toast", () => ({
  __esModule: true,
  default: ({ message }) => <div data-testid="toast">{message}</div>,
}));

const mockUser = {
  _id: "user-1",
  name: "Test User",
  email: "test@example.com",
};

const renderProfile = () =>
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    localStorage.setItem("token", "test-token");

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: mockUser,
      }),
    });
  });

  // ...every test block below stays 100% unchanged
  test("shows loading state while profile is being fetched", () => {
    global.fetch.mockImplementation(
      () => new Promise(() => {})
    );

    renderProfile();

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  test("redirects to login when no token exists", async () => {
    localStorage.removeItem("token");

    renderProfile();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("fetches and displays the user's profile", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/me"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );
  });

  test("keeps Save Changes disabled when the name is unchanged", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeDisabled();
  });

  test("enables Save Changes after changing the name", async () => {
    renderProfile();

    const nameInput = await screen.findByDisplayValue("Test User");

    fireEvent.change(nameInput, {
      target: { value: "Updated User" },
    });

    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeEnabled();
  });

  test("updates the profile successfully", async () => {
    renderProfile();

    const nameInput = await screen.findByDisplayValue("Test User");

    fireEvent.change(nameInput, {
      target: { value: "Updated User" },
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          ...mockUser,
          name: "Updated User",
        },
      }),
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Save Changes" })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/profile"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            name: "Updated User",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully")
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem("user")).toContain("Updated User");
  });

  test("shows an error when the name is empty", async () => {
    renderProfile();

    const nameInput = await screen.findByDisplayValue("Test User");

    fireEvent.change(nameInput, {
      target: { value: "   " },
    });

    fireEvent.submit(nameInput.closest("form"));

    expect(
      await screen.findByText("Name is required.")
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("validates required password fields", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    const updateButton = screen.getByRole("button", {
      name: "Update Password",
    });

    expect(updateButton).toBeDisabled();

    const passwordForm = screen.getByLabelText("Current Password")
      .closest("form");

    fireEvent.submit(passwordForm);

    expect(
      await screen.findByText("Current password is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("New password is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please confirm your new password.")
    ).toBeInTheDocument();
  });

  test("rejects a new password shorter than 8 characters", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "short" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "short" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(
      await screen.findByText("Password must be at least 8 characters.")
    ).toBeInTheDocument();
  });

  test("rejects passwords that do not match", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(
      await screen.findByText("Passwords do not match.")
    ).toBeInTheDocument();
  });

  test("shows and hides the current password", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    const input = screen.getByLabelText("Current Password");
    const toggle = screen.getByRole("button", {
      name: "Show current password",
    });

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggle);

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide current password" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Hide current password" })
    );

    expect(input).toHaveAttribute("type", "password");
  });

  test("shows and hides the new password", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    const input = screen.getByLabelText("New Password");

    fireEvent.click(
      screen.getByRole("button", { name: "Show new password" })
    );

    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: "Hide new password" })
    );

    expect(input).toHaveAttribute("type", "password");
  });

  test("shows and hides the confirm password", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    const input = screen.getByLabelText("Confirm New Password");

    fireEvent.click(
      screen.getByRole("button", { name: "Show confirm password" })
    );

    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: "Hide confirm password" })
    );

    expect(input).toHaveAttribute("type", "password");
  });

  test("changes the password successfully", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpassword" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword123" },
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Password updated successfully",
      }),
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/password"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            currentPassword: "oldpassword",
            newPassword: "newpassword123",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Password updated successfully")
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Current Password")).toHaveValue("");
    expect(screen.getByLabelText("New Password")).toHaveValue("");
    expect(screen.getByLabelText("Confirm New Password")).toHaveValue("");
  });

  test("shows an error when the current password is incorrect", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword123" },
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: "Current password is incorrect",
      }),
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(
      await screen.findByText("Current password is incorrect.")
    ).toBeInTheDocument();
  });

  test("uploads a profile image successfully", async () => {
    renderProfile();

    await screen.findByDisplayValue("Test User");

    const file = new File(
      ["profile-image"],
      "profile.png",
      { type: "image/png" }
    );

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          ...mockUser,
          profileImage: "/uploads/profile.png",
        },
      }),
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    );

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/profile-image"),
        expect.objectContaining({
          method: "PUT",
          headers: {
            Authorization: "Bearer test-token",
          },
          body: expect.any(FormData),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Profile image updated successfully")
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem("user")).toContain(
      "/uploads/profile.png"
    );
  });
});