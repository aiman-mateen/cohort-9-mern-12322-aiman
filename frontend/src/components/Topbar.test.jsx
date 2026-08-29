import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Topbar from "./Topbar";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderTopbar = (
    searchQuery = "",
    onSearchChange = jest.fn(),
    darkMode = false,
    onToggleTheme = jest.fn()
) => {
    return render(
        <MemoryRouter>
            <Topbar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                darkMode={darkMode}
                onToggleTheme={onToggleTheme}
            />
        </MemoryRouter>
    );
};

describe("Topbar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("renders the search input", () => {
        renderTopbar();

        expect(
            screen.getByRole("textbox", { name: "Search your notes" })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Search your notes...")
        ).toBeInTheDocument();
    });

    test("displays the current search query", () => {
        renderTopbar("important notes");

        const searchInput = screen.getByRole("textbox", {
            name: "Search your notes",
        });

        expect(searchInput).toHaveValue("important notes");
    });

    test("calls onSearchChange when the user types", () => {
        const onSearchChange = jest.fn();

        renderTopbar("", onSearchChange);

        const searchInput = screen.getByRole("textbox", {
            name: "Search your notes",
        });

        fireEvent.change(searchInput, {
            target: { value: "meeting notes" },
        });

        expect(onSearchChange).toHaveBeenCalledTimes(1);
        expect(onSearchChange).toHaveBeenCalledWith("meeting notes");
    });

    test("renders dark mode button when dark mode is disabled", () => {
        renderTopbar("", jest.fn(), false);

        const themeButton = screen.getByRole("button", {
            name: "Switch to dark mode",
        });

        expect(themeButton).toBeInTheDocument();
        expect(themeButton).toHaveTextContent("🌙");
        expect(themeButton).toHaveAttribute(
            "title",
            "Switch to dark mode"
        );
    });

    test("renders light mode button when dark mode is enabled", () => {
        renderTopbar("", jest.fn(), true);

        const themeButton = screen.getByRole("button", {
            name: "Switch to light mode",
        });

        expect(themeButton).toBeInTheDocument();
        expect(themeButton).toHaveTextContent("☀️");
        expect(themeButton).toHaveAttribute(
            "title",
            "Switch to light mode"
        );
    });

    test("calls onToggleTheme when theme button is clicked", () => {
        const onToggleTheme = jest.fn();

        renderTopbar("", jest.fn(), false, onToggleTheme);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Switch to dark mode",
            })
        );

        expect(onToggleTheme).toHaveBeenCalledTimes(1);
    });

    test("renders the notifications button", () => {
        renderTopbar();

        expect(
            screen.getByRole("button", {
                name: "Notifications",
            })
        ).toBeInTheDocument();
    });

    test("displays the stored user's name and initial", () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                name: "Aiman",
                email: "aiman@example.com",
            })
        );

        renderTopbar();

        expect(screen.getByText("Aiman")).toBeInTheDocument();
        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("My workspace")).toBeInTheDocument();
    });

    test("uses User as the default name when no user is stored", () => {
        renderTopbar();

        expect(screen.getByText("User")).toBeInTheDocument();
        expect(screen.getByText("U")).toBeInTheDocument();
        expect(screen.getByText("My workspace")).toBeInTheDocument();
    });

    test("navigates to the profile page when the profile button is clicked", () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                name: "Aiman",
                email: "aiman@example.com",
            })
        );

        renderTopbar();

        const profileButton = screen.getByRole("button", {
            name: /Aiman.*My workspace/i,
        });

        fireEvent.click(profileButton);

        expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
});

