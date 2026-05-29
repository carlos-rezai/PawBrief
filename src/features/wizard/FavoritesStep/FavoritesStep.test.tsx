import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FavoritesStep from "./FavoritesStep";
import type { FavoritesData } from "../../../types/profile";

function renderFavoritesStep(onSave = vi.fn()) {
  render(<FavoritesStep onSave={onSave} />);
}

describe("FavoritesStep toy entries", () => {
  it("starts with no toy entries and an Add toy button", () => {
    renderFavoritesStep();
    expect(
      screen.getByRole("button", { name: /add toy/i })
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId("toy-entry")).toHaveLength(0);
  });

  it("clicking Add toy appends a row with Name and Description fields", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add toy/i }));
    const entry = screen.getByTestId("toy-entry");
    expect(within(entry).getByLabelText(/name/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("clicking Remove toy removes the entry", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add toy/i }));
    await user.click(screen.getByRole("button", { name: /remove toy/i }));
    expect(screen.queryAllByTestId("toy-entry")).toHaveLength(0);
  });
});

describe("FavoritesStep treat entries", () => {
  it("clicking Add treat appends a row with Brand and Flavor fields", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add treat/i }));
    const entry = screen.getByTestId("treat-entry");
    expect(within(entry).getByLabelText(/brand/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/flavor/i)).toBeInTheDocument();
  });

  it("clicking Remove treat removes the entry", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add treat/i }));
    await user.click(screen.getByRole("button", { name: /remove treat/i }));
    expect(screen.queryAllByTestId("treat-entry")).toHaveLength(0);
  });
});

describe("FavoritesStep comfort items", () => {
  it("clicking Add comfort item appends a text field", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add comfort item/i }));
    expect(screen.getByTestId("comfort-item")).toBeInTheDocument();
  });

  it("clicking Remove comfort item removes it", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(screen.getByRole("button", { name: /add comfort item/i }));
    await user.click(
      screen.getByRole("button", { name: /remove comfort item/i })
    );
    expect(screen.queryAllByTestId("comfort-item")).toHaveLength(0);
  });
});

describe("FavoritesStep favourite spots", () => {
  it("clicking Add favourite spot appends a text field", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(
      screen.getByRole("button", { name: /add favourite spot/i })
    );
    expect(screen.getByTestId("favourite-spot")).toBeInTheDocument();
  });

  it("clicking Remove favourite spot removes it", async () => {
    const user = userEvent.setup();
    renderFavoritesStep();
    await user.click(
      screen.getByRole("button", { name: /add favourite spot/i })
    );
    await user.click(
      screen.getByRole("button", { name: /remove favourite spot/i })
    );
    expect(screen.queryAllByTestId("favourite-spot")).toHaveLength(0);
  });
});

describe("FavoritesStep onSave", () => {
  it("calls onSave with all four entry arrays when Next is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<FavoritesStep onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0] as FavoritesData;
    expect(saved).toHaveProperty("toyEntries");
    expect(saved).toHaveProperty("treatEntries");
    expect(saved).toHaveProperty("comfortItems");
    expect(saved).toHaveProperty("favouriteSpots");
  });
});

describe("FavoritesStep initialData", () => {
  it("pre-fills toy entries from initialData", () => {
    const initialData: FavoritesData = {
      toyEntries: [{ name: "Feather wand", description: "With bells" }],
      treatEntries: [],
      comfortItems: [],
      favouriteSpots: [],
    };
    render(<FavoritesStep initialData={initialData} />);
    expect(screen.getByDisplayValue("Feather wand")).toBeInTheDocument();
  });
});
