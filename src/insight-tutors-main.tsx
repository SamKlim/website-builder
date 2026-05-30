import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InsightTutorsPage } from "./pages/InsightTutorsPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InsightTutorsPage />
  </StrictMode>,
);
