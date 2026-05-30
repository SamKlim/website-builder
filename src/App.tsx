import { Route, Routes, Link } from "react-router-dom";
import { HaloPage } from "./pages/HaloPage";
import { MaxReedPage } from "./pages/MaxReedPage";
import { AxionStudioPage } from "./pages/AxionStudioPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-4 p-8 font-sans">
            <p className="text-neutral-600 text-sm">Website Builder examples</p>
            <Link className="text-blue-600 underline" to="/halo">
              Halo landing page
            </Link>
            <Link className="text-blue-600 underline" to="/max-reed">
              Max Reed portfolio
            </Link>
            <Link className="text-blue-600 underline" to="/axion">
              Axion Studio design agency
            </Link>
          </div>
        }
      />
      <Route path="/halo" element={<HaloPage />} />
      <Route path="/max-reed" element={<MaxReedPage />} />
      <Route path="/axion" element={<AxionStudioPage />} />
    </Routes>
  );
}
