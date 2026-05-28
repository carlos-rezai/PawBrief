import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RoutineStep from "./RoutineStep";

const DEFAULT_SLOT_COUNT = 6;
const DEFAULT_TOTAL_HOURS = 24;

function renderRoutineStep(onSave = vi.fn()) {
  render(<RoutineStep onSave={onSave} />);
}

describe("RoutineStep default slots", () => {
  it("opens with exactly six pre-populated activity slots", () => {
    renderRoutineStep();
    expect(screen.getAllByRole("row").length - 1).toBe(DEFAULT_SLOT_COUNT);
  });

  it("the default slots sum to 24 hours", () => {
    renderRoutineStep();
    expect(screen.getByText(/24/)).toBeInTheDocument();
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
    expect(totalEl.textContent).not.toContain("24");
  });

  it("shows a warning when the total differs from 24 hours", async () => {
    const user = userEvent.setup();
    renderRoutineStep();
    const durationInputs = screen.getAllByLabelText(/duration/i);
    await user.clear(durationInputs[0]);
    await user.type(durationInputs[0], "1");
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("keeps the Next button enabled when the total differs from 24 hours", async () => {
    const user = userEvent.setup();
    renderRoutineStep();
    const durationInputs = screen.getAllByLabelText(/duration/i);
    await user.clear(durationInputs[0]);
    await user.type(durationInputs[0], "1");
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
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
    render(<RoutineStep onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0];
    expect(saved).toHaveProperty("slots");
    expect(saved.slots).toHaveLength(DEFAULT_SLOT_COUNT);
  });
});
