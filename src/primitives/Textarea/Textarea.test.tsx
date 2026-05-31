import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Textarea from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="notes" />);
    expect(screen.getByRole("textbox", { name: /notes/i })).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="notes" value="" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Textarea hasError", () => {
  it("sets aria-invalid when hasError is true", () => {
    render(<Textarea aria-label="notes" hasError />);
    expect(screen.getByRole("textbox", { name: /notes/i })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("does not set aria-invalid when hasError is omitted", () => {
    render(<Textarea aria-label="notes" />);
    expect(screen.getByRole("textbox", { name: /notes/i })).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });
});
