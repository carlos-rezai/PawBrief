import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it } from "vitest";
import { theme } from "../../tokens";
import { saveProfile } from "../../features/profile";
import { ToastProvider } from "../../components/Toast/Toast";
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
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

// ── Existing behaviours ────────────────────────────────────────────────────

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
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <MemoryRouter initialEntries={["/wizard/new"]}>
            <Routes>
              <Route path="/wizard/new" element={<WizardPage />} />
              <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });
});

describe("WizardPage step navigation", () => {
  it("submitting a step saves data and navigates to the next step", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("nav-test"));
    render(
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <MemoryRouter initialEntries={["/wizard/nav-test/step/basics"]}>
            <Routes>
              <Route path="/wizard/:id/step/:step" element={<WizardPage />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Luna");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(
      await screen.findByRole("button", { name: /add food entry/i })
    ).toBeInTheDocument();
  });
});

// ── Stepper ────────────────────────────────────────────────────────────────

describe("WizardPage Stepper", () => {
  it("renders all six step labels on every step", async () => {
    await saveProfile(makeProfile("stepper-labels-test"));
    renderWizardAt("/wizard/stepper-labels-test/step/basics");
    await screen.findByLabelText(/name/i);
    expect(
      screen.getByRole("button", { name: /^basics$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^feeding$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^routine$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^favourites$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^medical$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^notes$/i })
    ).toBeInTheDocument();
  });

  it("marks the current step as active in the Stepper", async () => {
    await saveProfile(makeProfileWithFeeding("stepper-active-test"));
    renderWizardAt("/wizard/stepper-active-test/step/feeding");
    expect(
      await screen.findByRole("button", { name: /^feeding$/i })
    ).toHaveAttribute("aria-current", "step");
  });

  it("in Edit Mode clicking an earlier Stepper step navigates there", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfileWithFeeding("edit-mode-jump-test"));
    renderWizardAt("/wizard/edit-mode-jump-test/step/feeding");
    await screen.findByRole("button", { name: /add food entry/i });
    await user.click(screen.getByRole("button", { name: /^basics$/i }));
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });

  it("in create flow clicking a future Stepper step does not navigate", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("create-flow-test"));
    renderWizardAt("/wizard/create-flow-test/step/basics");
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^feeding$/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add food entry/i })
    ).not.toBeInTheDocument();
  });
});

// ── Footer navigation ──────────────────────────────────────────────────────

describe("WizardPage footer navigation", () => {
  it("clicking Cancel on the Basics step navigates to the Dashboard", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("footer-basics-test"));
    renderWizardAt("/wizard/footer-basics-test/step/basics");
    await screen.findByLabelText(/name/i);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("the Back button is enabled on the Feeding step", async () => {
    await saveProfile(makeProfileWithFeeding("footer-feeding-test"));
    renderWizardAt("/wizard/footer-feeding-test/step/feeding");
    expect(
      await screen.findByRole("button", { name: /back/i })
    ).not.toBeDisabled();
  });

  it("labels the submit button 'Finish' on the Notes step", async () => {
    await saveProfile(makeProfile("footer-notes-test"));
    renderWizardAt("/wizard/footer-notes-test/step/notes");
    expect(
      await screen.findByRole("button", { name: /finish/i })
    ).toBeInTheDocument();
  });
});

// ── Step Card ──────────────────────────────────────────────────────────────

describe("WizardPage Step Card", () => {
  it("renders the step name as a heading on the Basics step", async () => {
    await saveProfile(makeProfile("step-card-basics-test"));
    renderWizardAt("/wizard/step-card-basics-test/step/basics");
    expect(
      await screen.findByRole("heading", { name: /basics/i })
    ).toBeInTheDocument();
  });

  it("renders the step name as a heading on the Routine step", async () => {
    await saveProfile(makeProfile("step-card-routine-test"));
    renderWizardAt("/wizard/step-card-routine-test/step/routine");
    expect(
      await screen.findByRole("heading", { name: /routine/i })
    ).toBeInTheDocument();
  });
});

// ── Toast ──────────────────────────────────────────────────────────────────

describe("WizardPage Toast", () => {
  it("fires a 'Draft saved' Toast when Next is clicked", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("toast-test"));
    renderWizardAt("/wizard/toast-test/step/basics");
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Luna");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(await screen.findByText(/draft saved/i)).toBeInTheDocument();
  });
});

// ── Finish flow ────────────────────────────────────────────────────────────

describe("WizardPage Finish flow", () => {
  it("shows a success dialog when Finish is clicked on the Notes step", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("finish-dialog-test"));
    renderWizardAt("/wizard/finish-dialog-test/step/notes");
    await user.click(await screen.findByRole("button", { name: /finish/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("dismissing the success dialog navigates to the Dashboard", async () => {
    const user = userEvent.setup();
    await saveProfile(makeProfile("finish-nav-test"));
    renderWizardAt("/wizard/finish-nav-test/step/notes");
    await user.click(await screen.findByRole("button", { name: /finish/i }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /done/i }));
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
