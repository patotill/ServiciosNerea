import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { App } from "../app";
import { ROUTES } from "./routes";
import RegisterClient from "../views/singUp/registerClient";
import RegisterProfesional from "../views/singUp/registerProfesional";

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
        <Route path={ROUTES.REGISTRO_CLIENTE} element={<RegisterClient />} />
        <Route
          path={ROUTES.REGISTRO_PROFESIONAL}
          element={<RegisterProfesional />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
