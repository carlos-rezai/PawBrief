import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../tokens";
import ProfileCard from "./ProfileCard";
import type { CatProfile } from "../../types/profile";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

const draftProfile: CatProfile = {
  id: "draft-1",
  completedSteps: ["basics"],
  basics: { name: "Luna", breed: "Siamese", ageValue: 2, ageUnit: "years" },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const completeProfile: CatProfile = {
  id: "complete-1",
  completedSteps: [
    "basics",
    "feeding",
    "routine",
    "favorites",
    "medical",
    "notes",
  ],
  basics: {
    name: "Biscuit",
    breed: "British Shorthair",
    ageValue: 3,
    ageUnit: "years",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const defaultProps = {
  mergeMode: false,
  selected: false,
  selectable: false,
  onEdit: vi.fn(),
  onAction: vi.fn(),
  onDelete: vi.fn(),
  onSelect: vi.fn(),
};

describe("ProfileCard status badge", () => {
  it("shows Draft badge for an incomplete profile", () => {
    renderWithTheme(<ProfileCard profile={draftProfile} {...defaultProps} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows Complete badge for a fully completed profile", () => {
    renderWithTheme(
      <ProfileCard profile={completeProfile} {...defaultProps} />
    );
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });
});

describe("ProfileCard profile info", () => {
  it("renders the cat name", () => {
    renderWithTheme(<ProfileCard profile={draftProfile} {...defaultProps} />);
    expect(screen.getByText("Luna")).toBeInTheDocument();
  });

  it("renders breed and age", () => {
    renderWithTheme(<ProfileCard profile={draftProfile} {...defaultProps} />);
    expect(screen.getByText(/Siamese/)).toBeInTheDocument();
    expect(screen.getByText(/2 year/)).toBeInTheDocument();
  });
});

describe("ProfileCard action buttons", () => {
  it("shows Edit, Generate PDF, and Delete buttons for a complete profile", () => {
    renderWithTheme(
      <ProfileCard profile={completeProfile} {...defaultProps} />
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate pdf/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("shows Continue (not Generate PDF) for a draft profile", () => {
    renderWithTheme(<ProfileCard profile={draftProfile} {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /continue/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /generate pdf/i })
    ).not.toBeInTheDocument();
  });

  it("calls onEdit when the Edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderWithTheme(
      <ProfileCard
        profile={completeProfile}
        {...defaultProps}
        onEdit={onEdit}
      />
    );
    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("calls onAction when the Generate PDF button is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderWithTheme(
      <ProfileCard
        profile={completeProfile}
        {...defaultProps}
        onAction={onAction}
      />
    );
    await user.click(screen.getByRole("button", { name: /generate pdf/i }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("calls onDelete when the Delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderWithTheme(
      <ProfileCard
        profile={completeProfile}
        {...defaultProps}
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});

describe("ProfileCard merge mode", () => {
  it("hides action buttons in merge mode", () => {
    renderWithTheme(
      <ProfileCard
        profile={completeProfile}
        {...defaultProps}
        mergeMode
        selectable
      />
    );
    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /generate pdf/i })
    ).not.toBeInTheDocument();
  });

  it("calls onSelect when card is clicked in merge mode (selectable)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = renderWithTheme(
      <ProfileCard
        profile={completeProfile}
        {...defaultProps}
        mergeMode
        selectable
        onSelect={onSelect}
      />
    );
    await user.click(container.firstChild as HTMLElement);
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
