import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import Modal from "./Modal";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("Modal", () => {
  it("renders children inside the overlay", () => {
    renderWithTheme(
      <Modal onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Modal onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when dialog content is clicked", () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Modal onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
