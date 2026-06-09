import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Regression guard for the browser Buffer polyfill (issue #33).
// @react-pdf/renderer references a global `Buffer` when decoding photo images;
// without it, generating a care guide for a profile with a photo throws
// "Buffer is not defined" in the browser. This cannot be caught by a runtime
// assertion because Node (and this test runner) always define `Buffer`, so we
// guard the wiring statically instead.

const main = readFileSync(resolve(process.cwd(), "src/main.tsx"), "utf8");
const polyfills = readFileSync(
  resolve(process.cwd(), "src/polyfills.ts"),
  "utf8"
);

describe("browser Buffer polyfill guard", () => {
  it("main.tsx imports the polyfill before anything else", () => {
    const firstImport = main
      .split("\n")
      .find((line) => line.trim().startsWith("import"));
    expect(firstImport).toContain("./polyfills");
  });

  it("polyfills.ts installs Buffer from the buffer package onto globalThis", () => {
    expect(polyfills).toContain('from "buffer"');
    expect(polyfills).toMatch(/globalThis[\s\S]*?\.Buffer\s*=/);
  });
});
