import "@testing-library/jest-dom";
import { vi } from "vitest";

// @testing-library/react checks for a global `jest` to detect fake timers and advance them
// inside its asyncWrapper. Vitest doesn't expose `jest` globally, so we alias `vi` to it.
(globalThis as Record<string, unknown>).jest = vi;
