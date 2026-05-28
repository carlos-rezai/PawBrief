import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveProfile } from "../../features/profile";
import DashboardPage from "./DashboardPage";

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

function renderDashboard() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route index element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );
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
});
