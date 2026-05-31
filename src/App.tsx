import { Route, Routes } from "react-router-dom";
import { InsightTutorsPage } from "./pages/InsightTutorsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InsightTutorsPage />} />
    </Routes>
  );
}
