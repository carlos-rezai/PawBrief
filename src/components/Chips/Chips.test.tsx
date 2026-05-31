import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import Chips from "./Chips";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("Chips", () => {
  it("renders the current chip list", () => {
    renderWithTheme(<Chips values={["07:30", "18:00"]} onChange={vi.fn()} />);
    expect(screen.getByText("07:30")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
  });

  it("adds a chip when Enter is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(<Chips values={[]} onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "07:30");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(["07:30"]);
  });

  it("adds a chip when the Add button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(<Chips values={[]} onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "18:00");
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(onChange).toHaveBeenCalledWith(["18:00"]);
  });

  it("removes a chip when its dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(<Chips values={["07:30", "18:00"]} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Remove 07:30" }));
    expect(onChange).toHaveBeenCalledWith(["18:00"]);
  });
});
