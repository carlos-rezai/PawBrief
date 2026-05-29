import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveProfile } from "../../features/profile";
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
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="preview/:id" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderDashboardForMerge() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="preview/merge/:id1/:id2" element={<LocationDisplay />} />
        <Route path="preview/:id" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>
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
    expect(await screen.findByText(/new profile/i)).toBeInTheDocument();
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

  it("removes the profile card when Delete is clicked", async () => {
    const user = userEvent.setup();
    await saveProfile(makeBasicsProfile("p-3"));
    renderDashboard();
    const deleteBtn = await screen.findByRole("button", { name: /delete/i });
    await user.click(deleteBtn);
    await waitFor(() => {
      expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
    });
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
  it("shows a 'Merge two profiles' button", async () => {
    renderDashboardForMerge();
    expect(
      await screen.findByRole("button", { name: /merge two profiles/i })
    ).toBeInTheDocument();
  });

  it("complete profiles become selectable after clicking 'Merge two profiles'", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("m1", "Luna"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge two profiles/i })
    );
    expect(
      await screen.findByRole("checkbox", { name: /luna/i })
    ).toBeInTheDocument();
  });

  it("incomplete profiles have no checkbox in merge mode", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("complete-1", "Luna"));
    await saveProfile(makeBasicsProfile("incomplete-1"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge two profiles/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);
  });

  it("selecting two complete profiles shows a 'Preview Merge' button", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("sel1", "Luna"));
    await saveProfile(makeCompleteProfile("sel2", "Whiskers"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge two profiles/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(
      await screen.findByRole("button", { name: /preview merge/i })
    ).toBeInTheDocument();
  });

  it("selecting a third complete profile deselects the first-selected", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("p1", "Cat One"));
    await saveProfile(makeCompleteProfile("p2", "Cat Two"));
    await saveProfile(makeCompleteProfile("p3", "Cat Three"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge two profiles/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(checkboxes[2]);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("clicking 'Preview Merge' navigates to /preview/merge/:id1/:id2", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("merge-a", "Luna"));
    await saveProfile(makeCompleteProfile("merge-b", "Whiskers"));
    renderDashboardForMerge();
    await user.click(
      await screen.findByRole("button", { name: /merge two profiles/i })
    );
    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(
      await screen.findByRole("button", { name: /preview merge/i })
    );
    const location = await screen.findByTestId("location");
    expect(location.textContent).toMatch(/\/preview\/merge\//);
    expect(location.textContent).toContain("merge-a");
    expect(location.textContent).toContain("merge-b");
  });
});
