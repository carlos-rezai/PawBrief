import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FeedingStep from "./FeedingStep";
import type { FeedingData } from "../../../types/profile";

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

function renderFeedingStep(onSave = vi.fn()) {
  render(<FeedingStep onSave={onSave} />);
}

describe("FeedingStep food entries", () => {
  it("renders with no food entries and an add food entry button", () => {
    renderFeedingStep();
    expect(
      screen.getByRole("button", { name: /add food entry/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/brand/i)).not.toBeInTheDocument();
  });

  it("clicking add food entry appends a row with Brand, Flavor, Texture fields", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add food entry/i }));
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/flavor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/texture/i)).toBeInTheDocument();
  });

  it("clicking remove on a food entry removes that row", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add food entry/i }));
    const removeButton = screen.getByRole("button", {
      name: /remove food entry/i,
    });
    await user.click(removeButton);
    expect(screen.queryByLabelText(/brand/i)).not.toBeInTheDocument();
  });
});

describe("FeedingStep serving amount", () => {
  it("has a numeric serving amount field", () => {
    renderFeedingStep();
    const input = screen.getByLabelText(/serving amount/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });
});

describe("FeedingStep feeding times", () => {
  it("clicking add feeding time appends a time entry", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add feeding time/i }));
    expect(screen.getAllByLabelText(/feeding time/i)).toHaveLength(1);
  });

  it("clicking remove on a feeding time entry removes it", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add feeding time/i }));
    await user.click(
      screen.getByRole("button", { name: /remove feeding time/i })
    );
    expect(screen.queryByLabelText(/feeding time/i)).not.toBeInTheDocument();
  });
});

describe("FeedingStep supplement entries", () => {
  it("clicking add supplement appends a row with Brand and Flavor fields", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add supplement/i }));
    const supplementRows = screen
      .getAllByLabelText(/brand/i)
      .filter((el) => el.closest("[data-testid='supplement-entry']"));
    expect(supplementRows.length).toBeGreaterThan(0);
  });

  it("clicking remove on a supplement entry removes it", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    await user.click(screen.getByRole("button", { name: /add supplement/i }));
    await user.click(
      screen.getByRole("button", { name: /remove supplement/i })
    );
    expect(
      screen.queryByRole("button", { name: /remove supplement/i })
    ).not.toBeInTheDocument();
  });
});

describe("FeedingStep plating photo upload", () => {
  it("submitting with a plating photo calls onSave with a non-null platingPhotoId", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<FeedingStep onSave={onSave} />);
    await user.upload(
      screen.getByLabelText(/plating photo/i),
      new File(["fake-image"], "plating.jpg", { type: "image/jpeg" })
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ platingPhotoId: expect.any(String) })
      );
    });
  });

  it("shows an inline error when a non-image file is uploaded as plating photo", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    const input = screen.getByLabelText(/plating photo/i);
    await user.upload(
      input,
      new File(["data"], "doc.pdf", { type: "application/pdf" })
    );
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/image/i);
  });

  it("shows an inline error when the plating photo exceeds 5 MB", async () => {
    const user = userEvent.setup();
    renderFeedingStep();
    const input = screen.getByLabelText(/plating photo/i);
    await user.upload(
      input,
      new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", {
        type: "image/jpeg",
      })
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});

describe("FeedingStep initialData", () => {
  it("pre-fills food entries from initialData", () => {
    const initialData: FeedingData = {
      foodEntries: [
        { brand: "Royal Canin", flavor: "Chicken", texture: "dry" },
      ],
      servingGrams: 50,
      feedingTimes: [],
      supplementEntries: [],
      platingInstructions: "",
    };
    render(<FeedingStep initialData={initialData} />);
    expect(screen.getByDisplayValue("Royal Canin")).toBeInTheDocument();
  });
});

describe("FeedingStep onSave", () => {
  it("calls onSave with all form data when Next is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<FeedingStep onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /add food entry/i }));
    const brandInput = screen.getByLabelText(/brand/i);
    await user.type(brandInput, "Royal Canin");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0];
    expect(saved).toHaveProperty("foodEntries");
    expect(saved).toHaveProperty("servingGrams");
    expect(saved).toHaveProperty("feedingTimes");
    expect(saved).toHaveProperty("supplementEntries");
    expect(saved).toHaveProperty("platingInstructions");
  });
});
