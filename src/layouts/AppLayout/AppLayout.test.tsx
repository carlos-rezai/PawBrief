import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppLayout } from "./AppLayout";

function renderAtRoute(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<main>Dashboard</main>} />
          <Route path="wizard/new" element={<main>Wizard</main>} />
          <Route path="preview/:id" element={<main>Preview</main>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AppLayout", () => {
  it("renders the dashboard child on the index route", () => {
    renderAtRoute("/");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders the wizard child on the wizard route", () => {
    renderAtRoute("/wizard/new");
    expect(screen.getByText("Wizard")).toBeInTheDocument();
  });

  it("renders the preview child on the preview route", () => {
    renderAtRoute("/preview/test");
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });
});
