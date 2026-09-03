import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./Settings";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/settings" }),
}));

jest.mock("../components/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock("../components/Topbar", () => ({
  __esModule: true,
  default: ({ darkMode, onToggleTheme }) => (
    <div data-testid="topbar">
      <span data-testid="dark-mode-state">
        {darkMode ? "dark" : "light"}
      </span>

      <button onClick={onToggleTheme}>
        Toggle Theme
      </button>
    </div>
  ),
}));

const renderSettings = () => {
  return render(<Settings />);
};

describe("Settings Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.clear();

    document.documentElement.removeAttribute("data-theme");
  });


  test("renders the Settings page", () => {
    renderSettings();

    expect(screen.getByText("Settings")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Manage your account and application preferences."
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("topbar")).toBeInTheDocument();
  });

  test("renders the Profile, Theme, and Logout sections", () => {
    renderSettings();

    expect(screen.getByRole("heading", { name: "Profile" }))
      .toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Theme" }))
      .toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Logout" }))
      .toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Manage Profile" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Switch to Dark Mode" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Logout" })
    ).toBeInTheDocument();
  });

  test("uses light mode by default when no theme is stored", () => {
    renderSettings();

    expect(document.documentElement)
      .toHaveAttribute("data-theme", "light");

    expect(localStorage.getItem("theme"))
      .toBe("light");

    expect(
      screen.getByRole("button", { name: "Switch to Dark Mode" })
    ).toBeInTheDocument();
  });

  test("loads dark mode when dark theme is stored", () => {
    localStorage.setItem("theme", "dark");

    renderSettings();

    expect(document.documentElement)
      .toHaveAttribute("data-theme", "dark");

    expect(localStorage.getItem("theme"))
      .toBe("dark");

    expect(
      screen.getByRole("button", { name: "Switch to Light Mode" })
    ).toBeInTheDocument();
  });

  test("switches from light mode to dark mode", () => {
    renderSettings();

    const themeButton = screen.getByRole("button", {
      name: "Switch to Dark Mode",
    });

    fireEvent.click(themeButton);

    expect(document.documentElement)
      .toHaveAttribute("data-theme", "dark");

    expect(localStorage.getItem("theme"))
      .toBe("dark");

    expect(
      screen.getByRole("button", { name: "Switch to Light Mode" })
    ).toBeInTheDocument();
  });

  test("switches from dark mode to light mode", () => {
    localStorage.setItem("theme", "dark");

    renderSettings();

    const themeButton = screen.getByRole("button", {
      name: "Switch to Light Mode",
    });

    fireEvent.click(themeButton);

    expect(document.documentElement)
      .toHaveAttribute("data-theme", "light");

    expect(localStorage.getItem("theme"))
      .toBe("light");

    expect(
      screen.getByRole("button", { name: "Switch to Dark Mode" })
    ).toBeInTheDocument();
  });

  test("navigates to profile when Manage Profile is clicked", () => {
    renderSettings();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Manage Profile",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("logs out the user and navigates to login", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Test User",
        email: "test@example.com",
      })
    );

    renderSettings();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    );

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

