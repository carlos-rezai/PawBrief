import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BasicsStep from "./BasicsStep";

beforeEach(() => {
  // jsdom does not implement canvas rendering; provide stubs for EXIF stripping
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = vi
    .fn()
    .mockImplementation((cb: BlobCallback) =>
      cb(new Blob(["img"], { type: "image/jpeg" }))
    ) as unknown as typeof HTMLCanvasElement.prototype.toBlob;
});

function renderBasicsStep(onSave = vi.fn()) {
  render(
    <MemoryRouter>
      <BasicsStep onSave={onSave} />
    </MemoryRouter>
  );
}

describe("BasicsStep photo upload", () => {
  it("shows an inline error when a non-image file is uploaded", async () => {
    const user = userEvent.setup();
    renderBasicsStep();
    const input = screen.getByLabelText(/photo/i);
    const nonImage = new File(["data"], "document.pdf", {
      type: "application/pdf",
    });
    await user.upload(input, nonImage);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/image/i);
  });

  it("shows an inline error when an image over 5 MB is uploaded", async () => {
    const user = userEvent.setup();
    renderBasicsStep();
    const input = screen.getByLabelText(/photo/i);
    const oversized = new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    await user.upload(input, oversized);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
