import { beforeAll, describe, expect, it, vi } from "vitest";

const mockRegister = vi.fn();

vi.mock("@react-pdf/renderer", () => ({
  Font: { register: mockRegister },
}));

describe("pdfFonts font registration", () => {
  beforeAll(async () => {
    await import("./pdfFonts");
  });

  it("registers Plus Jakarta Sans exactly once", () => {
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  it("registers with family name 'Plus Jakarta Sans'", () => {
    expect(mockRegister).toHaveBeenCalledWith(
      expect.objectContaining({ family: "Plus Jakarta Sans" })
    );
  });

  it("registers all 5 required weights (400, 500, 600, 700, 800)", () => {
    const [args] = mockRegister.mock.calls;
    const weights = (args[0].fonts as { fontWeight: number }[]).map(
      (f) => f.fontWeight
    );
    expect(weights).toHaveLength(5);
    expect(weights).toContain(400);
    expect(weights).toContain(500);
    expect(weights).toContain(600);
    expect(weights).toContain(700);
    expect(weights).toContain(800);
  });
});
