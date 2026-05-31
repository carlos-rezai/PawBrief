import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import { ToastProvider, useToast } from "./Toast";

function TestComponent({ message }: { message: string }) {
  const { enqueue } = useToast();
  return <button onClick={() => enqueue(message)}>Show toast</button>;
}

function renderWithTheme(message: string) {
  return render(
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <TestComponent message={message} />
      </ToastProvider>
    </ThemeProvider>
  );
}

describe("Toast / ToastProvider / useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("enqueued message appears in the DOM", async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    renderWithTheme("Draft saved");
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Draft saved")).toBeInTheDocument();
  });

  it("toast auto-dismisses after a timeout", async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    renderWithTheme("Draft saved");
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Draft saved")).toBeInTheDocument();
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByText("Draft saved")).not.toBeInTheDocument();
  });
});
