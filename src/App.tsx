import { Route, Routes } from "react-router-dom";
import { ShowcaseIndexPage } from "./pages/ShowcaseIndexPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShowcaseIndexPage />} />
    </Routes>
  );
}
