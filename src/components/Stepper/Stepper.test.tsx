import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import Stepper from "./Stepper";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("Stepper", () => {
  it("renders all six step labels", () => {
    renderWithTheme(<Stepper currentStep={0} onStepClick={vi.fn()} />);
    expect(screen.getByText("Basics")).toBeInTheDocument();
    expect(screen.getByText("Feeding")).toBeInTheDocument();
    expect(screen.getByText("Routine")).toBeInTheDocument();
    expect(screen.getByText("Favourites")).toBeInTheDocument();
    expect(screen.getByText("Medical")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("marks the current step as active with aria-current", () => {
    renderWithTheme(<Stepper currentStep={2} onStepClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /routine/i })).toHaveAttribute(
      "aria-current",
      "step"
    );
  });

  it("does not mark other steps as active", () => {
    renderWithTheme(<Stepper currentStep={2} onStepClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /basics/i })).not.toHaveAttribute(
      "aria-current",
      "step"
    );
  });

  it("calls onStepClick with the correct index when a step is clicked", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    renderWithTheme(<Stepper currentStep={0} onStepClick={onStepClick} />);
    await user.click(screen.getByRole("button", { name: /feeding/i }));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });
});
