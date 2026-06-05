import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { saveProfile } from "../../features/profile";
import PreviewPage from "./PreviewPage";

vi.mock("@react-pdf/renderer", () => ({
  PDFViewer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-viewer">{children}</div>
  ),
  PDFDownloadLink: ({
    children,
  }: {
    children: (state: { loading: boolean }) => React.ReactNode;
  }) => (
    <div data-testid="pdf-download-link">{children({ loading: false })}</div>
  ),
  Document: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Image: () => null,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  StyleSheet: { create: (styles: unknown) => styles },
  Font: { register: vi.fn() },
  Svg: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Circle: () => null,
  Ellipse: () => null,
  G: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Path: () => null,
}));

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderAtRoute(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route index element={<LocationDisplay />} />
        <Route path="preview/:id" element={<PreviewPage />} />
        <Route path="wizard/:id/step/:step" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>
  );
}

function makeCompleteProfile(id: string) {
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
    basics: { name: "Luna", ageValue: 3, ageUnit: "years" as const },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("PreviewPage", () => {
  it("redirects to the dashboard when the profile ID does not exist", async () => {
    renderAtRoute("/preview/nonexistent-id");
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/");
  });

  it("shows a Download PDF button for a complete profile", async () => {
    await saveProfile(makeCompleteProfile("dl-test"));
    renderAtRoute("/preview/dl-test");
    expect(
      await screen.findByRole("button", { name: /download pdf/i })
    ).toBeInTheDocument();
  });

  it("shows an Edit Profile button for a complete profile", async () => {
    await saveProfile(makeCompleteProfile("edit-test"));
    renderAtRoute("/preview/edit-test");
    expect(
      await screen.findByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
  });

  it("clicking Edit Profile navigates to the wizard basics step with returnTo=preview", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("nav-test"));
    renderAtRoute("/preview/nav-test");
    const editBtn = await screen.findByRole("button", {
      name: /edit profile/i,
    });
    await user.click(editBtn);
    const location = await screen.findByTestId("location");
    expect(location.textContent).toContain("/wizard/nav-test/step/basics");
  });
});
