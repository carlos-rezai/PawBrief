import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Regression guard for the production CSP (issue #33).
// The PDF layer (@react-pdf/renderer -> @react-pdf/layout -> yoga-layout) is a
// WebAssembly module loaded from an inlined data: URI. Under the strict CSP the
// care guide preview renders blank, because:
//   1. connect-src blocks the fetch() of the data: wasm binary, and
//   2. script-src blocks WebAssembly.instantiate().
// These two narrowly-scoped exceptions are required for PDF generation and must
// never silently regress. See docs/security/security-review-2026-06-07.md.
//
// They are the *minimum* relaxation:
//   - 'wasm-unsafe-eval' permits only wasm compilation, NOT eval()/new Function().
//   - data: in connect-src is not a network origin, so the "no external network
//     transmission" promise still holds.

const vercelJson = readFileSync(resolve(process.cwd(), "vercel.json"), "utf8");

const csp = (
  JSON.parse(vercelJson) as {
    headers: { headers: { key: string; value: string }[] }[];
  }
).headers
  .flatMap((rule) => rule.headers)
  .find((h) => h.key === "Content-Security-Policy")?.value;

describe("production CSP guard", () => {
  it("defines a Content-Security-Policy header", () => {
    expect(csp).toBeDefined();
  });

  it("allows wasm compilation for the PDF layer without enabling eval", () => {
    expect(csp).toMatch(/script-src[^;]*'wasm-unsafe-eval'/);
    // The broad eval escape hatch must NOT be present — wasm-unsafe-eval is enough.
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it("allows the inlined data: wasm to be fetched without opening external origins", () => {
    expect(csp).toMatch(/connect-src[^;]*\bdata:/);
    // connect-src must not be widened to arbitrary hosts.
    expect(csp).toMatch(/connect-src 'self' data:;/);
  });

  it("allows the generated PDF blob to be framed by the preview without opening external origins", () => {
    // PDFViewer renders the care guide in an <iframe src="blob:...">.
    expect(csp).toMatch(/frame-src[^;]*\bblob:/);
    // frame-src stays same-origin + blob: only — no arbitrary framed hosts.
    expect(csp).toMatch(/frame-src 'self' blob:;/);
  });

  it("keeps the rest of the strict posture intact", () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("font-src 'self'");
    // script-src is still self-anchored — no remote script origins.
    expect(csp).toMatch(/script-src 'self' 'wasm-unsafe-eval';/);
  });
});
