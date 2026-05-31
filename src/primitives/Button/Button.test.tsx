import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import Button from "./Button";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("defaults to type button", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("accepts type submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when the disabled prop is passed", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Button kind prop", () => {
  it("kind=primary renders an enabled button", () => {
    renderWithTheme(<Button kind="primary">Save</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("kind=secondary renders an enabled button", () => {
    renderWithTheme(<Button kind="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("kind=ghost renders an enabled button", () => {
    renderWithTheme(<Button kind="ghost">Back</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("kind=disabled renders a disabled button", () => {
    renderWithTheme(<Button kind="disabled">Confirm</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Button size prop", () => {
  it("size=sm renders", () => {
    renderWithTheme(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("size=md renders", () => {
    renderWithTheme(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("size=lg renders", () => {
    renderWithTheme(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("Button iconOnly prop", () => {
  it("iconOnly renders an accessible button", () => {
    renderWithTheme(
      <Button iconOnly aria-label="Add item">
        +
      </Button>
    );
    expect(
      screen.getByRole("button", { name: /add item/i })
    ).toBeInTheDocument();
  });
});
