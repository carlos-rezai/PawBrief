import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input aria-label="field" />);
    expect(screen.getByLabelText(/field/i)).toBeInTheDocument();
  });

  it("passes the type prop through", () => {
    render(<Input type="number" aria-label="count" />);
    expect(screen.getByLabelText(/count/i)).toHaveAttribute("type", "number");
  });

  it("calls onChange when the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="field" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText(/field/i), "a");
    expect(onChange).toHaveBeenCalled();
  });
});
