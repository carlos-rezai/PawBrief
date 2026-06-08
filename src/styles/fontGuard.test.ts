import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Regression guard for the self-hosted font slice (issue #29).
// Locks in two things that must never silently regress:
//   1. index.html makes no request to Google Fonts.
//   2. The global stylesheet registers Plus Jakarta Sans as a same-origin
//      @font-face sourced only from the bundled .ttf assets.

const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

const globalStyles = readFileSync(
  resolve(process.cwd(), "src/styles/GlobalStyles.ts"),
  "utf8"
);

describe("font self-hosting guard", () => {
  it("index.html has no Google Fonts references", () => {
    expect(indexHtml).not.toContain("fonts.googleapis.com");
    expect(indexHtml).not.toContain("fonts.gstatic.com");
  });

  it("global stylesheet registers a Plus Jakarta Sans @font-face sourced only from the bundled assets", () => {
    expect(globalStyles).toContain("@font-face");
    expect(globalStyles).toContain("Plus Jakarta Sans");
    expect(globalStyles).toMatch(/assets\/fonts\/[^"'`]+\.ttf/);
    // No external origin in the stylesheet — the font is same-origin only.
    expect(globalStyles).not.toMatch(/https?:\/\//);
  });
});
