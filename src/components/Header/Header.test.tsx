import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { theme } from "../../tokens";
import Header from "./Header";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
}

describe("Header", () => {
  it("renders a navigation landmark", () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the PawBrief wordmark link to /", () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("img", { name: /pawbrief wordmark/i })
    ).toBeInTheDocument();
  });

  it("renders children alongside the wordmark", () => {
    renderWithProviders(
      <Header>
        <button>Merge guides</button>
      </Header>
    );
    expect(
      screen.getByRole("button", { name: /merge guides/i })
    ).toBeInTheDocument();
  });
});
