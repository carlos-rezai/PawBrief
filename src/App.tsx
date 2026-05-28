import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout/AppLayout";
import { DashboardPage, PreviewPage, WizardPage } from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="wizard/new" element={<WizardPage />} />
          <Route path="preview/:id" element={<PreviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
