import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ActivitySlot } from "../../types/profile";
import { RoutineClock } from "./RoutineClock";

vi.mock("@react-pdf/renderer", () => ({
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Svg: ({ children }: { children?: React.ReactNode }) => <svg>{children}</svg>,
  Circle: () => null,
  Ellipse: () => null,
  G: ({ children }: { children?: React.ReactNode }) => <g>{children}</g>,
  Path: () => null,
  StyleSheet: { create: (s: unknown) => s },
  Font: { register: vi.fn() },
}));

const slots: ActivitySlot[] = [
  { label: "Sleep", start: "22:00", hours: 8, colorIndex: 0 },
  { label: "Play", start: "10:00", hours: 2, colorIndex: 1 },
];

describe("RoutineClock", () => {
  it("renders clock-face time labels", () => {
    render(<RoutineClock slots={slots} />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("06:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
  });

  it("renders the A DAY centre label", () => {
    render(<RoutineClock slots={slots} />);
    expect(screen.getByText("A DAY")).toBeInTheDocument();
  });
});
