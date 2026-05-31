import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BasicsStep from "./BasicsStep";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = vi
    .fn()
    .mockImplementation((cb: BlobCallback) =>
      cb(new Blob(["img"], { type: "image/jpeg" }))
    ) as unknown as typeof HTMLCanvasElement.prototype.toBlob;
  globalThis.URL.createObjectURL = vi.fn(() => "blob:fake-preview-url");
  globalThis.URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("shows a preview image immediately after a valid photo is selected", async () => {
    const user = userEvent.setup();
    renderBasicsStep();
    const input = screen.getByLabelText(/photo/i);
    await user.upload(
      input,
      new File(["fake-image"], "cat.jpg", { type: "image/jpeg" })
    );
    const preview = await screen.findByAltText(/cat photo preview/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", "blob:fake-preview-url");
  });

  it("submitting with a photo file calls onSave with a non-null photoId", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<BasicsStep onSave={onSave} />);
    await user.type(screen.getByLabelText(/name/i), "Luna");
    await user.upload(
      screen.getByLabelText(/photo/i),
      new File(["fake-image"], "cat.jpg", { type: "image/jpeg" })
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ photoId: expect.any(String) })
      );
    });
  });
});
