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
  it("renders a navbar on the dashboard route", () => {
    renderAtRoute("/");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders a navbar on the wizard route", () => {
    renderAtRoute("/wizard/new");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders a navbar on the preview route", () => {
    renderAtRoute("/preview/test");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("logo link points to /", () => {
    renderAtRoute("/wizard/new");
    const logo = screen.getByRole("link", { name: /pawbrief/i });
    expect(logo).toHaveAttribute("href", "/");
  });
});
