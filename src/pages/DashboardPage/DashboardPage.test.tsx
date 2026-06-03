import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "styled-components";
import { saveProfile } from "../../features/profile";
import { ToastProvider } from "../../components";
import { theme } from "../../tokens";
import DashboardPage from "./DashboardPage";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

function renderDashboard() {
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="preview/:id" element={<LocationDisplay />} />
          <Route path="wizard/:id/step/:step" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
}

function renderDashboardForMerge() {
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="preview/merge/:id1/:id2" element={<LocationDisplay />} />
          <Route path="preview/:id" element={<LocationDisplay />} />
          <Route path="wizard/:id/step/:step" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
}

function makeCompleteProfile(id: string, name: string) {
  return {
    id,
    completedSteps: [
      "basics",
      "feeding",
      "routine",
      "favorites",
      "medical",
      "notes",
    ] as (
      | "basics"
      | "feeding"
      | "routine"
      | "favorites"
      | "medical"
      | "notes"
    )[],
    basics: { name, ageValue: 2, ageUnit: "years" as const },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function makeBasicsProfile(id: string) {
  return {
    id,
    completedSteps: ["basics"] as (
      | "basics"
      | "feeding"
      | "routine"
      | "favorites"
      | "medical"
      | "notes"
    )[],
    basics: {
      name: "Whiskers",
      breed: "Maine Coon",
      ageValue: 3,
      ageUnit: "years" as const,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("DashboardPage", () => {
  it("shows a call-to-action when no profiles exist", async () => {
    renderDashboard();
    expect(
      await screen.findByRole("button", { name: /new cat profile/i })
    ).toBeInTheDocument();
  });

  it("shows a profile card with name, breed, and age after a Basics-only profile is saved", async () => {
    await saveProfile(makeBasicsProfile("p-1"));
    renderDashboard();
    expect(await screen.findByText("Whiskers")).toBeInTheDocument();
    expect(await screen.findByText(/Maine Coon/i)).toBeInTheDocument();
    expect(await screen.findByText(/3 year/i)).toBeInTheDocument();
  });

  it("shows Continue (not Generate PDF) for a Basics-only profile", async () => {
    await saveProfile(makeBasicsProfile("p-2"));
    renderDashboard();
    expect(
      await screen.findByRole("button", { name: /continue/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /generate pdf/i })
    ).not.toBeInTheDocument();
  });

  it("shows Generate PDF (not Continue) when all 6 steps are completed", async () => {
    await saveProfile({
      id: "p-complete",
      completedSteps: [
        "basics",
        "feeding",
        "routine",
        "favorites",
        "medical",
        "notes",
      ],
      basics: { name: "Max", ageValue: 2, ageUnit: "years" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    renderDashboard();
    expect(
      await screen.findByRole("button", { name: /generate pdf/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /continue/i })
    ).not.toBeInTheDocument();
  });

  it("removes the profile card when Delete is clicked and confirmed", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("p-3"));
    renderDashboard();
    await user.click(await screen.findByRole("button", { name: /delete/i }));
    await user.click(
      await screen.findByRole("button", { name: /delete profile/i })
    );
    await waitFor(() => {
      expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
    });
  });

  it("clicking Continue navigates to the next incomplete step", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("continue-nav-test"));
    renderDashboard();
    await user.click(await screen.findByRole("button", { name: /continue/i }));
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent(
      "/wizard/continue-nav-test/step/feeding"
    );
  });

  it("clicking Edit navigates to the basics step", async () => {
    const user = userEvent.setup();
    await saveProfile({
      id: "edit-nav-test",
      completedSteps: [
        "basics",
        "feeding",
        "routine",
        "favorites",
        "medical",
        "notes",
      ],
      basics: { name: "Max", ageValue: 2, ageUnit: "years" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    renderDashboard();
    await user.click(await screen.findByRole("button", { name: /^edit$/i }));
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/wizard/edit-nav-test/step/basics");
  });

  it("clicking Generate PDF navigates to /preview/:id", async () => {
    const user = userEvent.setup();
    await saveProfile({
      id: "pdf-nav-test",
      completedSteps: [
        "basics",
        "feeding",
        "routine",
        "favorites",
        "medical",
        "notes",
      ],
      basics: { name: "Luna", ageValue: 3, ageUnit: "years" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    renderDashboard();
    const generateBtn = await screen.findByRole("button", {
      name: /generate pdf/i,
    });
    await user.click(generateBtn);
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/preview/pdf-nav-test");
  });
});

describe("DashboardPage merge mode", () => {
  it("shows a 'Merge guides' button", async () => {
    renderDashboardForMerge();
    expect(
      await screen.findByRole("button", { name: /merge guides/i })
    ).toBeInTheDocument();
  });

  it("complete profiles become selectable after clicking 'Merge guides'", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("m1", "Luna"));
    await saveProfile(makeCompleteProfile("m2", "Biscuit"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    expect(
      await screen.findByRole("checkbox", { name: /luna/i })
    ).toBeInTheDocument();
  });

  it("incomplete profiles have no checkbox in merge mode", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("complete-1", "Luna"));
    await saveProfile(makeCompleteProfile("complete-2", "Biscuit"));
    await saveProfile(makeBasicsProfile("incomplete-1"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("selecting two complete profiles enables 'Create merged guide'", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("sel1", "Luna"));
    await saveProfile(makeCompleteProfile("sel2", "Whiskers"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(
      await screen.findByRole("button", { name: /create merged guide/i })
    ).not.toBeDisabled();
  });

  it("selecting a third complete profile deselects the first-selected", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("p1", "Cat One"));
    await saveProfile(makeCompleteProfile("p2", "Cat Two"));
    await saveProfile(makeCompleteProfile("p3", "Cat Three"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(checkboxes[2]);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("clicking 'Create merged guide' navigates to /preview/merge/:id1/:id2", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("merge-a", "Luna"));
    await saveProfile(makeCompleteProfile("merge-b", "Whiskers"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(
      await screen.findByRole("button", { name: /create merged guide/i })
    );
    const location = await screen.findByTestId("location");
    expect(location.textContent).toMatch(/\/preview\/merge\//);
    expect(location.textContent).toContain("merge-a");
    expect(location.textContent).toContain("merge-b");
  });
});

// ─── Issue #14: Dashboard surface ────────────────────────────────────────────

function renderDashboardWithProviders() {
  render(
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="preview/:id" element={<LocationDisplay />} />
            <Route
              path="preview/merge/:id1/:id2"
              element={<LocationDisplay />}
            />
            <Route path="wizard/:id/step/:step" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

describe("DashboardPage visual shell", () => {
  it("renders the PawBrief Wordmark in the navbar", async () => {
    renderDashboardWithProviders();
    expect(
      await screen.findByRole("img", { name: /pawbrief wordmark/i })
    ).toBeInTheDocument();
  });

  it("clicking the Plus Card creates a profile and navigates to the wizard basics step", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("plus-card-test"));
    renderDashboardWithProviders();
    // Wait for the profile to load so PlusCard is visible (avoids EmptyState timing race)
    await screen.findByText(/start the care-guide wizard/i);
    await user.click(screen.getByRole("button", { name: /new cat profile/i }));
    const location = await screen.findByTestId("location");
    expect(location.textContent).toMatch(/\/wizard\/.+\/step\/basics/);
  });
});

describe("DashboardPage 'Merge guides' button state", () => {
  it("'Merge guides' button is disabled when there are no profiles", async () => {
    renderDashboardWithProviders();
    expect(
      await screen.findByRole("button", { name: /merge guides/i })
    ).toBeDisabled();
  });

  it("'Merge guides' button is disabled when only one complete profile exists", async () => {
    await saveProfile(makeCompleteProfile("mg-single", "Luna"));
    renderDashboardWithProviders();
    expect(
      await screen.findByRole("button", { name: /merge guides/i })
    ).toBeDisabled();
  });

  it("'Merge guides' button is enabled when two or more complete profiles exist", async () => {
    await saveProfile(makeCompleteProfile("mg-1", "Luna"));
    await saveProfile(makeCompleteProfile("mg-2", "Biscuit"));
    renderDashboardWithProviders();
    await screen.findByText("Luna"); // wait for profiles to load
    expect(
      screen.getByRole("button", { name: /merge guides/i })
    ).not.toBeDisabled();
  });
});

describe("DashboardPage merge-select action bar", () => {
  it("shows a live selection count in the action bar during merge-select mode", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("ab-1", "Luna"));
    await saveProfile(makeCompleteProfile("ab-2", "Biscuit"));
    renderDashboardWithProviders();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    expect(await screen.findByText(/1 of 2 selected/i)).toBeInTheDocument();
  });

  it("'Create merged guide' CTA is enabled when exactly two profiles are selected", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("ab-3", "Luna"));
    await saveProfile(makeCompleteProfile("ab-4", "Biscuit"));
    renderDashboardWithProviders();
    await user.click(
      await screen.findByRole("button", { name: /merge guides/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(await screen.findByText(/2 of 2 selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create merged guide/i })
    ).not.toBeDisabled();
  });
});

describe("DashboardPage delete with ConfirmModal", () => {
  it("clicking Delete opens a ConfirmModal without immediately removing the profile", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("cm-1"));
    renderDashboardWithProviders();
    await user.click(await screen.findByRole("button", { name: /delete/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("Whiskers").length).toBeGreaterThan(0);
  });

  it("cancelling the ConfirmModal leaves the profile in the list", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("cm-2"));
    renderDashboardWithProviders();
    await user.click(await screen.findByRole("button", { name: /delete/i }));
    await user.click(await screen.findByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Whiskers")).toBeInTheDocument();
  });

  it("confirming the ConfirmModal removes the profile from the list", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("cm-3"));
    renderDashboardWithProviders();
    await user.click(await screen.findByRole("button", { name: /delete/i }));
    await user.click(
      await screen.findByRole("button", { name: /delete profile/i })
    );
    await waitFor(() => {
      expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
    });
  });
});

describe("DashboardPage Toast notifications", () => {
  it("shows a toast with the cat's name after confirming delete", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("toast-del-1"));
    renderDashboardWithProviders();
    await user.click(await screen.findByRole("button", { name: /delete/i }));
    await user.click(
      await screen.findByRole("button", { name: /delete profile/i })
    );
    expect(await screen.findByText(/whiskers deleted/i)).toBeInTheDocument();
  });
});
