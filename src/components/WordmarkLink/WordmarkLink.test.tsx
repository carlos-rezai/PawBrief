import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import WordmarkLink from "./WordmarkLink";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("WordmarkLink", () => {
  it("renders the PawBrief wordmark", () => {
    renderWithRouter(<WordmarkLink />);
    expect(
      screen.getByRole("img", { name: /pawbrief wordmark/i })
    ).toBeInTheDocument();
  });

  it("wraps the wordmark in a link to /", () => {
    renderWithRouter(<WordmarkLink />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});
