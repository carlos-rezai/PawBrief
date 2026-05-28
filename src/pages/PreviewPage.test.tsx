import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import PreviewPage from "./PreviewPage";

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
      </Routes>
    </MemoryRouter>
  );
}

describe("PreviewPage", () => {
  it("redirects to the dashboard when the profile ID does not exist", async () => {
    renderAtRoute("/preview/nonexistent-id");
    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/");
  });
});
