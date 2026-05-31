import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { theme } from "../tokens";
import { GlobalStyles } from "./GlobalStyles";

describe("GlobalStyles", () => {
  it("renders without crashing within ThemeProvider", () => {
    expect(() =>
      render(
        <ThemeProvider theme={theme}>
          <GlobalStyles />
        </ThemeProvider>
      )
    ).not.toThrow();
  });
});
