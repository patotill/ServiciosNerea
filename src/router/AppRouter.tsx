
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { App } from "../app";
import { ROUTES } from "./routes";
import ClienteDashboard from "../views/profile/ClienteDashboard";
import ProfesionalDashboard from "../views/profile/ProfesionalDashboard";
function NotFound() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <Link to={ROUTES.LOGIN}>Volver al inicio</Link>
    </main>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<App />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
<Route path="/profesional" element={<ProfesionalDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
