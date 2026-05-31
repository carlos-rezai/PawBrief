import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Wordmark from "./Wordmark";

describe("Wordmark", () => {
  it("renders without throwing", () => {
    const { container } = render(<Wordmark />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders as an SVG element", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("contains no img elements", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("has role img", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("svg")).toHaveAttribute("role", "img");
  });

  it("has an aria-label", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-label");
  });

  it("sets height from the size prop", () => {
    const { container } = render(<Wordmark size={32} />);
    expect(container.querySelector("svg")).toHaveAttribute("height", "32");
  });
});
