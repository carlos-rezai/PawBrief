import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import BasicsStep from "./BasicsStep";

function renderBasicsStep() {
  render(<BasicsStep />);
}

describe("BasicsStep fields", () => {
  it("renders Name, Breed, Age, and Photo fields", () => {
    renderBasicsStep();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo/i)).toBeInTheDocument();
  });

  it("renders a Next button", () => {
    renderBasicsStep();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});

describe("BasicsStep photo upload", () => {
  it("shows an inline error when a non-image file is uploaded", async () => {
    const user = userEvent.setup();
    renderBasicsStep();
    const input = screen.getByLabelText(/photo/i);
    await user.upload(
      input,
      new File(["data"], "doc.pdf", { type: "application/pdf" })
    );
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/image/i);
  });

  it("shows an inline error when an image over 5 MB is uploaded", async () => {
    const user = userEvent.setup();
    renderBasicsStep();
    const input = screen.getByLabelText(/photo/i);
    await user.upload(
      input,
      new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
        type: "image/jpeg",
      })
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
