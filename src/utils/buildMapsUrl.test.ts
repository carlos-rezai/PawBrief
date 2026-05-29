import { describe, expect, it } from "vitest";
import { buildMapsUrl } from "./buildMapsUrl";

describe("buildMapsUrl", () => {
  it("returns a Google Maps search URL for a standard address", () => {
    const url = buildMapsUrl("123 Main St, Springfield, IL 62701");
    expect(url).toMatch(/^https:\/\/www\.google\.com\/maps\/search\//);
    expect(url).toContain("api=1");
    expect(url).toContain("query=");
  });

  it("encodes spaces so the URL contains no raw spaces", () => {
    const url = buildMapsUrl("123 Main Street");
    expect(url).not.toContain(" ");
  });

  it("returns an empty string when the address is empty", () => {
    expect(buildMapsUrl("")).toBe("");
  });
});
