import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotesStep from "./NotesStep";
import type { NotesData } from "../../../types/profile";

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
});

function renderNotesStep(onSave = vi.fn()) {
  render(<NotesStep onSave={onSave} />);
}

describe("NotesStep special notes", () => {
  it("starts with no notes and an Add note button", () => {
    renderNotesStep();
    expect(
      screen.getByRole("button", { name: /add note/i })
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId("special-note")).toHaveLength(0);
  });

  it("clicking Add note appends a row with Title, Description, and Photo fields", async () => {
    const user = userEvent.setup();
    renderNotesStep();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    const entry = screen.getByTestId("special-note");
    expect(within(entry).getByLabelText(/title/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/description/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/photo/i)).toBeInTheDocument();
  });

  it("clicking Remove note removes it", async () => {
    const user = userEvent.setup();
    renderNotesStep();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    await user.click(screen.getByRole("button", { name: /remove note/i }));
    expect(screen.queryAllByTestId("special-note")).toHaveLength(0);
  });
});

describe("NotesStep photo upload", () => {
  it("shows an error when a non-image file is uploaded for a note photo", async () => {
    const user = userEvent.setup();
    renderNotesStep();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    const entry = screen.getByTestId("special-note");
    const photoInput = within(entry).getByLabelText(/photo/i);
    await user.upload(
      photoInput,
      new File(["data"], "doc.pdf", { type: "application/pdf" })
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("shows an error when the note photo exceeds 5 MB", async () => {
    const user = userEvent.setup();
    renderNotesStep();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    const entry = screen.getByTestId("special-note");
    const photoInput = within(entry).getByLabelText(/photo/i);
    await user.upload(
      photoInput,
      new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
        type: "image/jpeg",
      })
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("submitting a note with a photo calls onSave with a non-null photoId on that note", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<NotesStep onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /add note/i }));
    const entry = screen.getByTestId("special-note");
    await user.upload(
      within(entry).getByLabelText(/photo/i),
      new File(["fake-image"], "note.jpg", { type: "image/jpeg" })
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce();
      const saved = onSave.mock.calls[0][0] as NotesData;
      expect(saved.specialNotes[0].photoId).toEqual(expect.any(String));
    });
  });
});

describe("NotesStep onSave", () => {
  it("calls onSave with the specialNotes array when Next is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<NotesStep onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0] as NotesData;
    expect(saved).toHaveProperty("specialNotes");
  });
});
