import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PhotoUpload from "./PhotoUpload";

describe("PhotoUpload rectangle variant", () => {
  it("renders 'Add photo' text", () => {
    render(<PhotoUpload />);
    expect(screen.getByText("Add photo")).toBeInTheDocument();
  });

  it("shows JPG / PNG hint text", () => {
    render(<PhotoUpload />);
    expect(screen.getByText(/JPG \/ PNG/)).toBeInTheDocument();
  });

  it("renders the field label when provided", () => {
    render(<PhotoUpload label="Plating photo" />);
    expect(screen.getByText("Plating photo")).toBeInTheDocument();
  });

  it("uses the label as the input aria-label", () => {
    render(<PhotoUpload label="Plating photo" />);
    expect(screen.getByLabelText(/plating photo/i)).toBeInTheDocument();
  });
});

describe("PhotoUpload round variant", () => {
  it("does not show the JPG / PNG hint", () => {
    render(<PhotoUpload round />);
    expect(screen.queryByText(/JPG \/ PNG/)).not.toBeInTheDocument();
  });
});

describe("PhotoUpload interactions", () => {
  it("calls onChange with the selected File", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PhotoUpload label="Plating photo" onChange={onChange} />);
    await user.upload(
      screen.getByLabelText(/plating photo/i),
      new File(["img"], "photo.jpg", { type: "image/jpeg" })
    );
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(File);
  });

  it("shows the error message with role=alert when error prop is set", () => {
    render(<PhotoUpload error="Only image files are allowed." />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/image/i);
  });
});

describe("PhotoUpload preview", () => {
  it("renders the preview image when previewUrl is provided", () => {
    render(
      <PhotoUpload previewUrl="blob:fake" previewAlt="Cat photo preview" />
    );
    const img = screen.getByAltText("Cat photo preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "blob:fake");
  });

  it("shows 'Change photo' overlay text when a preview is active", () => {
    render(<PhotoUpload previewUrl="blob:fake" />);
    expect(screen.getByText(/change photo/i)).toBeInTheDocument();
  });

  it("hides 'Add photo' and hint when preview is active", () => {
    render(<PhotoUpload previewUrl="blob:fake" />);
    expect(screen.queryByText("Add photo")).not.toBeInTheDocument();
    expect(screen.queryByText(/JPG \/ PNG/)).not.toBeInTheDocument();
  });
});
