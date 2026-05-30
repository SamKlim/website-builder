import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MaxReedPage } from "./pages/MaxReedPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MaxReedPage />
  </StrictMode>,
);
