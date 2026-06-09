import { Buffer } from "buffer";

// @react-pdf/renderer's image and pdfkit pipeline references a global `Buffer`
// (a Node.js global that does not exist in the browser). Without it, generating a
// care guide PDF for a profile that includes a photo throws "Buffer is not
// defined" — the image decoder runs only once the photo blob is fetched, so it
// stays latent until a profile actually has a photo. Provide the global before
// any react-pdf code runs. Must be imported first in main.tsx.
//
// This is a browser-only gap: in Node (and the Vitest/jsdom test runner) `Buffer`
// already exists, which is why a runtime test cannot meaningfully guard it — the
// static guard in polyfills.test.ts checks the wiring instead.
if (!("Buffer" in globalThis)) {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}
