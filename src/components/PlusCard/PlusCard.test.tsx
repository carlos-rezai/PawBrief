import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import PlusCard from "./PlusCard";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("PlusCard", () => {
  it("renders the new profile label", () => {
    renderWithTheme(<PlusCard onClick={vi.fn()} />);
    expect(screen.getByText("New cat profile")).toBeInTheDocument();
  });

  it("renders the hint text", () => {
    renderWithTheme(<PlusCard onClick={vi.fn()} />);
    expect(screen.getByText("Start the care-guide wizard")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(<PlusCard onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
