import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { saveProfile } from "../features/profile";
import type { WizardStep, FeedingData } from "../types/profile";
import WizardPage from "./WizardPage";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

const feedingData: FeedingData = {
  foodEntries: [{ brand: "Royal Canin", flavor: "Chicken", texture: "dry" }],
  servingGrams: 50,
  feedingTimes: ["08:00"],
  supplementEntries: [],
  platingInstructions: "",
};

function makeProfileWithFeeding(id: string) {
  return {
    id,
    completedSteps: ["basics", "feeding"] as WizardStep[],
    basics: { name: "Luna", ageValue: 2, ageUnit: "years" as const },
    feeding: feedingData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function renderWizardAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("WizardPage edit mode", () => {
  it("navigating to /wizard/:id/step/feeding renders the Feeding step", async () => {
    await saveProfile(makeProfileWithFeeding("routing-test"));
    renderWizardAt("/wizard/routing-test/step/feeding");
    expect(
      await screen.findByRole("button", { name: /add food entry/i })
    ).toBeInTheDocument();
  });

  it("pre-fills the Feeding step with existing profile data", async () => {
    await saveProfile(makeProfileWithFeeding("prefill-test"));
    renderWizardAt("/wizard/prefill-test/step/feeding");
    expect(await screen.findByDisplayValue("Royal Canin")).toBeInTheDocument();
  });
});
