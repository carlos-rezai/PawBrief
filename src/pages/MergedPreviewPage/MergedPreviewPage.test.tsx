import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { saveProfile } from "../../features/profile";
import MergedPreviewPage from "./MergedPreviewPage";

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
  G: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
}

function renderAtRoute(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route index element={<LocationDisplay />} />
        <Route path="preview/merge/:id1/:id2" element={<MergedPreviewPage />} />
        <Route path="wizard/:id/step/:step" element={<LocationDisplay />} />
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
    basics: { name, ageValue: 3, ageUnit: "years" as const },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("MergedPreviewPage", () => {
  it("redirects to dashboard when the first profile ID does not exist", async () => {
    await saveProfile(makeCompleteProfile("existing-b", "Whiskers"));
    renderAtRoute("/preview/merge/nonexistent/existing-b");
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/");
  });

  it("redirects to dashboard when the second profile ID does not exist", async () => {
    await saveProfile(makeCompleteProfile("existing-a", "Luna"));
    renderAtRoute("/preview/merge/existing-a/nonexistent");
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/");
  });

  it("shows Download PDF button when both profiles exist", async () => {
    await saveProfile(makeCompleteProfile("cat-a", "Luna"));
    await saveProfile(makeCompleteProfile("cat-b", "Whiskers"));
    renderAtRoute("/preview/merge/cat-a/cat-b");
    expect(
      await screen.findByRole("button", { name: /download pdf/i })
    ).toBeInTheDocument();
  });

  it("shows an Edit button labelled with Cat A's name", async () => {
    await saveProfile(makeCompleteProfile("cat-a", "Luna"));
    await saveProfile(makeCompleteProfile("cat-b", "Whiskers"));
    renderAtRoute("/preview/merge/cat-a/cat-b");
    expect(
      await screen.findByRole("button", { name: /edit luna/i })
    ).toBeInTheDocument();
  });

  it("shows an Edit button labelled with Cat B's name", async () => {
    await saveProfile(makeCompleteProfile("cat-a", "Luna"));
    await saveProfile(makeCompleteProfile("cat-b", "Whiskers"));
    renderAtRoute("/preview/merge/cat-a/cat-b");
    expect(
      await screen.findByRole("button", { name: /edit whiskers/i })
    ).toBeInTheDocument();
  });

  it("clicking Edit [Cat A] navigates to Cat A's wizard with returnTo=merge", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("nav-a", "Luna"));
    await saveProfile(makeCompleteProfile("nav-b", "Whiskers"));
    renderAtRoute("/preview/merge/nav-a/nav-b");
    const editBtn = await screen.findByRole("button", { name: /edit luna/i });
    await user.click(editBtn);
    const location = await screen.findByTestId("location");
    expect(location.textContent).toContain("/wizard/nav-a/step/basics");
    expect(location.textContent).toContain("returnTo=merge/nav-a/nav-b");
  });

  it("clicking Edit [Cat B] navigates to Cat B's wizard with returnTo=merge", async () => {
    const user = userEvent.setup();
    await saveProfile(makeCompleteProfile("nav-a", "Luna"));
    await saveProfile(makeCompleteProfile("nav-b", "Whiskers"));
    renderAtRoute("/preview/merge/nav-a/nav-b");
    const editBtn = await screen.findByRole("button", {
      name: /edit whiskers/i,
    });
    await user.click(editBtn);
    const location = await screen.findByTestId("location");
    expect(location.textContent).toContain("/wizard/nav-b/step/basics");
    expect(location.textContent).toContain("returnTo=merge/nav-a/nav-b");
  });
});
