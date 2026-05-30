import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HaloPage } from "./pages/HaloPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HaloPage />
  </StrictMode>,
);
