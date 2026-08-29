import { render } from "@testing-library/react";
import NoteCardSkeleton from "./NoteCardSkeleton";

describe("NoteCardSkeleton", () => {
    test("renders the skeleton card", () => {
        const { container } = render(<NoteCardSkeleton />);

        const skeletonCard = container.querySelector(".skeleton-card");

        expect(skeletonCard).toBeInTheDocument();
        expect(skeletonCard).toHaveClass("note-card");
    });

    test("renders the skeleton category", () => {
        const { container } = render(<NoteCardSkeleton />);

        const category = container.querySelector(".skeleton-category");

        expect(category).toBeInTheDocument();
        expect(category).toHaveClass("skeleton-line");
    });

    test("renders the skeleton title and text lines", () => {
        const { container } = render(<NoteCardSkeleton />);

        const title = container.querySelector(".skeleton-title");
        const textLines = container.querySelectorAll(".skeleton-text");

        expect(title).toBeInTheDocument();
        expect(title).toHaveClass("skeleton-line");

        expect(textLines).toHaveLength(2);
        textLines.forEach((line) => {
            expect(line).toHaveClass("skeleton-line");
        });
    });

    test("renders a short text skeleton line", () => {
        const { container } = render(<NoteCardSkeleton />);

        const shortLine = container.querySelector(".skeleton-text.short");

        expect(shortLine).toBeInTheDocument();
        expect(shortLine).toHaveClass("skeleton-line");
    });

    test("renders the skeleton footer and date", () => {
        const { container } = render(<NoteCardSkeleton />);

        const footer = container.querySelector(".skeleton-footer");
        const date = container.querySelector(".skeleton-date");

        expect(footer).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(date).toHaveClass("skeleton-line");
    });

    test("marks the skeleton as hidden from assistive technologies", () => {
        const { container } = render(<NoteCardSkeleton />);

        const skeletonCard = container.querySelector(".skeleton-card");

        expect(skeletonCard).toHaveAttribute("aria-hidden", "true");
    });
});
