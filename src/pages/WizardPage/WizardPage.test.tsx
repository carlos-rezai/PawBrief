import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { saveProfile } from "../../features/profile";
import type { WizardStep, FeedingData } from "../../types/profile";
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

function makeProfile(id: string) {
  return {
    id,
    completedSteps: [] as WizardStep[],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

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

describe("WizardPage new-profile flow", () => {
  it("navigating to /wizard/new calls createProfile and redirects to the basics step", async () => {
    render(
      <MemoryRouter initialEntries={["/wizard/new"]}>
        <Routes>
          <Route path="/wizard/new" element={<WizardPage />} />
          <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });
});

describe("WizardPage step navigation", () => {
  it("submitting a step saves data and navigates to the next step", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("nav-test"));
    render(
      <MemoryRouter initialEntries={["/wizard/nav-test/step/basics"]}>
        <Routes>
          <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
        </Routes>
      </MemoryRouter>
    );
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Luna");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(
      await screen.findByRole("button", { name: /add food entry/i })
    ).toBeInTheDocument();
  });

  it("submitting the final step navigates to the preview", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("preview-nav-test"));
    render(
      <MemoryRouter initialEntries={["/wizard/preview-nav-test/step/notes"]}>
        <Routes>
          <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
          <Route path="/preview/:id" element={<div>Preview</div>} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByRole("button", { name: /next/i });
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(await screen.findByText("Preview")).toBeInTheDocument();
  });
});
