import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { routinePalette, theme } from "../../tokens";
import RoutineChart from "./RoutineChart";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

const twoSlots = [
  { label: "Sleep", start: "22:00", hours: 9, colorIndex: 0 },
  { label: "Eat", start: "07:00", hours: 1, colorIndex: 1 },
];

describe("RoutineChart", () => {
  it("renders one path per Activity Slot", () => {
    const { container } = renderWithTheme(
      <RoutineChart slots={twoSlots} size={200} />
    );
    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(2);
  });

  it("applies routinePalette colors by colorIndex", () => {
    const { container } = renderWithTheme(
      <RoutineChart slots={twoSlots} size={200} />
    );
    const paths = container.querySelectorAll("svg path");
    expect(paths[0]).toHaveAttribute("stroke", routinePalette[0]);
    expect(paths[1]).toHaveAttribute("stroke", routinePalette[1]);
  });

  it("does not render a path for slots with zero hours", () => {
    const slotsWithZero = [
      { label: "Sleep", start: "22:00", hours: 9, colorIndex: 0 },
      { label: "Zero", start: "10:00", hours: 0, colorIndex: 1 },
    ];
    const { container } = renderWithTheme(
      <RoutineChart slots={slotsWithZero} size={200} />
    );
    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(1);
  });
});
