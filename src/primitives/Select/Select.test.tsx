import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Select from "./Select";

describe("Select", () => {
  it("renders a select with options", () => {
    render(
      <Select aria-label="unit">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    expect(screen.getByRole("combobox", { name: /unit/i })).toBeInTheDocument();
  });

  it("reflects the value prop", () => {
    render(
      <Select aria-label="unit" value="b" onChange={() => {}}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toHaveValue("b");
  });

  it("calls onChange when the selection changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select aria-label="unit" value="a" onChange={onChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    await user.selectOptions(screen.getByRole("combobox"), "b");
    expect(onChange).toHaveBeenCalled();
  });
});
