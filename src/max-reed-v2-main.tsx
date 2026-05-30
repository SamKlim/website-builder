import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MaxReedPageV2 } from "./pages/MaxReedPageV2";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MaxReedPageV2 />
  </StrictMode>,
);
