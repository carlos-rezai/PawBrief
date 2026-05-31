import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import Repeatable from "./Repeatable";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("Repeatable", () => {
  it("renders the entry list using the renderEntry prop", () => {
    renderWithTheme(
      <Repeatable
        entries={["Entry A", "Entry B"]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        renderEntry={(entry) => <span>{entry}</span>}
      />
    );
    expect(screen.getByText("Entry A")).toBeInTheDocument();
    expect(screen.getByText("Entry B")).toBeInTheDocument();
  });

  it("calls onAdd when the Add button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderWithTheme(
      <Repeatable
        entries={[]}
        onAdd={onAdd}
        onRemove={vi.fn()}
        renderEntry={() => <span />}
      />
    );
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("calls onRemove with the entry index when a Remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithTheme(
      <Repeatable
        entries={["Entry A", "Entry B"]}
        onAdd={vi.fn()}
        onRemove={onRemove}
        renderEntry={(entry) => <span>{entry}</span>}
      />
    );
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[1]);
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
