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

describe("Field optional flag", () => {
  it("renders an optional indicator when optional is true", () => {
    render(
      <Field label="Name" optional>
        <input />
      </Field>
    );
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });

  it("does not render an optional indicator when optional is not set", () => {
    render(
      <Field label="Name">
        <input />
      </Field>
    );
    expect(screen.queryByText(/optional/i)).not.toBeInTheDocument();
  });
});

describe("Field hint", () => {
  it("renders hint text when provided", () => {
    render(
      <Field label="Name" hint="Enter your full name">
        <input />
      </Field>
    );
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
  });
});

describe("Field error", () => {
  it("renders the error message when provided", () => {
    render(
      <Field label="Name" error="This field is required">
        <input />
      </Field>
    );
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("marks the error message as a live region", () => {
    render(
      <Field label="Name" error="This field is required">
        <input />
      </Field>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
