import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../../tokens";
import RoutineStep from "./RoutineStep";

const DEFAULT_SLOT_COUNT = 6;

function renderRoutineStep(onSave = vi.fn()) {
  render(
    <ThemeProvider theme={theme}>
      <RoutineStep onSave={onSave} />
    </ThemeProvider>
  );
}

describe("RoutineStep default slots", () => {
  it("opens with exactly six pre-populated activity slots", () => {
    renderRoutineStep();
    expect(screen.getAllByRole("row").length - 1).toBe(DEFAULT_SLOT_COUNT);
  });
});

describe("RoutineStep running total", () => {
  it("updates the running total when a slot duration is changed", async () => {
    const user = userEvent.setup();
    renderRoutineStep();
    const durationInputs = screen.getAllByLabelText(/duration/i);
    await user.clear(durationInputs[0]);
    await user.type(durationInputs[0], "10");
    const totalEl = screen.getByTestId("routine-total");
    expect(totalEl.textContent).not.toContain("17.5");
  });
});

describe("RoutineStep add and remove slots", () => {
  it("clicking Add slot appends a new editable row", async () => {
    const user = userEvent.setup();
    renderRoutineStep();
    await user.click(screen.getByRole("button", { name: /add slot/i }));
    expect(screen.getAllByRole("row").length - 1).toBe(DEFAULT_SLOT_COUNT + 1);
  });

  it("clicking remove on a slot removes it and updates the total", async () => {
    const user = userEvent.setup();
    renderRoutineStep();
    const removeButtons = screen.getAllByRole("button", {
      name: /remove slot/i,
    });
    await user.click(removeButtons[0]);
    expect(screen.getAllByRole("row").length - 1).toBe(DEFAULT_SLOT_COUNT - 1);
  });
});

describe("RoutineStep onSave", () => {
  it("calls onSave with the current slots when Next is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <RoutineStep onSave={onSave} />
      </ThemeProvider>
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0];
    expect(saved).toHaveProperty("slots");
    expect(saved.slots).toHaveLength(DEFAULT_SLOT_COUNT);
  });
});

// ── RoutineChart integration ───────────────────────────────────────────────

describe("RoutineStep RoutineChart", () => {
  it("renders a RoutineChart when the step has activity slots", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <RoutineStep />
      </ThemeProvider>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
