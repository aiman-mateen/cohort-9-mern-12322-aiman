import { render, screen, fireEvent } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
    test("renders the success toast with the message", () => {
        render(<Toast message="Note created successfully" />);

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
            screen.getByText("Note created successfully")
        ).toBeInTheDocument();

        expect(screen.getByRole("alert")).toHaveClass("toast-success");
    });

    test("renders the error toast with the message", () => {
        render(
            <Toast
                type="error"
                message="Something went wrong"
            />
        );

        const toast = screen.getByRole("alert");

        expect(toast).toBeInTheDocument();
        expect(toast).toHaveClass("toast-error");
        expect(
            screen.getByText("Something went wrong")
        ).toBeInTheDocument();
    });

    test("uses success type by default", () => {
        render(<Toast message="Saved successfully" />);

        expect(screen.getByRole("alert")).toHaveClass("toast-success");
    });

    test("calls onClose when the close button is clicked", () => {
        const onClose = jest.fn();

        render(
            <Toast
                message="Note deleted"
                onClose={onClose}
            />
        );

        const closeButton = screen.getByRole("button", {
            name: "Close notification",
        });

        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("renders the close notification button", () => {
        render(<Toast message="Test notification" />);

        expect(
            screen.getByRole("button", {
                name: "Close notification",
            })
        ).toBeInTheDocument();
    });
});
