import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useSesion from "../../hooks/sesion/useSesion";
import { ROLE_ROUTES, ROUTES } from "../../router/routes";
import { logout } from "../../services/authService";
import type { Rol } from "../../types/tables";
import AppColors from "../../utils/colors";

type RolDashboard = Extract<Rol, "cliente" | "profesional">;

type DashboardLayoutProps = PropsWithChildren<{
  rol: RolDashboard;
  color: keyof typeof AppColors;
  titulo: string;
}>;

/**
 * Exige sesión con el rol correcto: sin sesión vuelve al login y con otro rol
 * redirige al panel que le corresponde.
 */
export default function DashboardLayout({
  rol,
  color,
  titulo,
  children,
}: DashboardLayoutProps) {
  const { usuario, cargando } = useSesion();
  const navigate = useNavigate();
  const colores = AppColors[color];
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuAbierto) return;

    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();

    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        botonMenu.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menu.current) return;

      // El foco no sale del drawer mientras está abierto.
      const enfocables = menu.current.querySelectorAll<HTMLElement>("button:not(:disabled)");
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
    document.addEventListener("keydown", alTeclear);

    return () => {
      document.body.style.overflow = scrollPrevio;
      document.removeEventListener("keydown", alTeclear);
    };
  }, [menuAbierto]);

  if (cargando) {
    return <p role="status" className="p-6 text-slate-600">Cargando…</p>;
  }

  if (!usuario) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (usuario.rol !== rol) {
    return <Navigate to={ROLE_ROUTES[usuario.rol]} replace />;
  }

  async function cerrarSesion() {
    setCerrandoSesion(true);
    setErrorLogout(false);
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      setErrorLogout(true);
      setCerrandoSesion(false);
    }
  }

  function cerrarMenu() {
    setMenuAbierto(false);
    botonMenu.current?.focus();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className={`grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-4 py-3 text-white shadow sm:px-6 ${colores.bg}`}
      >
        <button
          ref={botonMenu}
          type="button"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          aria-controls="menu-lateral"
          className="flex h-11 w-11 items-center justify-center justify-self-start rounded-lg hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="3" y="4.5" width="18" height="3.5" rx="1.25" />
            <rect x="3" y="10.25" width="18" height="3.5" rx="1.25" />
            <rect x="3" y="16" width="18" height="3.5" rx="1.25" />
          </svg>
        </button>
        <h1 className="truncate text-center text-xl font-bold sm:text-2xl">
          Hola, {usuario.nombre ?? "bienvenido"}
        </h1>
        <p className="justify-self-end text-lg font-bold tracking-wide">
          NEREA
        </p>
      </header>

      <div
        onClick={cerrarMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity motion-reduce:transition-none ${
          menuAbierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={menu}
        id="menu-lateral"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!menuAbierto}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform motion-reduce:transition-none ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-gray-300 p-4">
          <div>
            <p className={`text-2xl font-bold ${colores.text}`}>NEREA</p>
            <p className="text-sm text-slate-700">Servicios y Reparaciones</p>
          </div>
          <button
            ref={botonCerrar}
            type="button"
            onClick={cerrarMenu}
            aria-label="Cerrar menú"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-auto border-t border-gray-300 p-4">
          {errorLogout && (
            <p
              role="alert"
              className={`mb-3 text-sm ${AppColors.red.text}`}
            >
              No se pudo cerrar la sesión. Probá de nuevo.
            </p>
          )}
          <button
            type="button"
            onClick={cerrarSesion}
            disabled={cerrandoSesion}
            aria-busy={cerrandoSesion}
            className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${colores.bg} ${colores.hover}`}
          >
            {cerrandoSesion ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        <p className={`font-medium ${colores.text}`}>{titulo}</p>
        {children}
      </main>
    </div>
  );
}
