// Must be first: installs the global Buffer that @react-pdf/renderer needs in the
// browser (see polyfills.ts). Importing it before react-pdf is pulled in is what
// keeps PDF generation working for profiles with photos.
import "./polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./tokens";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
