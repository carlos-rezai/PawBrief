import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Field from "./Field";

describe("Field", () => {
  it("renders the label text", () => {
    render(
      <Field label="Name">
        <input />
      </Field>
    );
    expect(screen.getByText(/name/i)).toBeInTheDocument();
  });

  it("associates the label with a child input", () => {
    render(
      <Field label="Email">
        <input />
      </Field>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders multiple children inside the label", () => {
    render(
      <Field label="Age">
        <input type="number" aria-label="age value" />
        <select aria-label="age unit">
          <option>years</option>
        </select>
      </Field>
    );
    expect(screen.getByLabelText(/age value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age unit/i)).toBeInTheDocument();
  });
});
