import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout/AppLayout";
import {
  DashboardPage,
  MergedPreviewPage,
  PreviewPage,
  WizardPage,
} from "./pages";
import { GlobalStyles } from "./styles/GlobalStyles";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="wizard/new" element={<WizardPage />} />
          <Route path="wizard/:id/step/:step" element={<WizardPage />} />
          <Route
            path="preview/merge/:id1/:id2"
            element={<MergedPreviewPage />}
          />
          <Route path="preview/:id" element={<PreviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
