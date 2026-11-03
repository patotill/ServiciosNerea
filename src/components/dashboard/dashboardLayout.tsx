import { useState, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { MENU_POR_ROL } from "../../config/menuPorRol";
import useMenuLateral from "../../hooks/dashboard/useMenuLateral";
import useUsuario from "../../hooks/sesion/useUsuario";
import { ROUTES } from "../../router/routes";
import { logout } from "../../services/authService";
import AppColors from "../../utils/colors";
import MenuLateral from "./menuLateral";

type DashboardLayoutProps = PropsWithChildren<{
  color: keyof typeof AppColors;
  titulo: string;
}>;

/** Estructura común de los paneles; el acceso por rol lo resuelve RutaProtegida. */
export default function DashboardLayout({
  color,
  titulo,
  children,
}: DashboardLayoutProps) {
  const usuario = useUsuario();
  const navigate = useNavigate();
  const colores = AppColors[color];
  const { abierto, abrir, cerrar, botonMenu, botonCerrar, menu } =
    useMenuLateral();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className={`grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-4 py-3 text-white shadow sm:px-6 ${colores.bg}`}
      >
        <button
          ref={botonMenu}
          type="button"
          onClick={abrir}
          aria-label="Abrir menú"
          aria-expanded={abierto}
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

      <MenuLateral
        abierto={abierto}
        onCerrar={cerrar}
        menuRef={menu}
        botonCerrarRef={botonCerrar}
        color={color}
        items={MENU_POR_ROL[usuario.rol]}
        onCerrarSesion={cerrarSesion}
        cerrandoSesion={cerrandoSesion}
        errorLogout={errorLogout}
      />

      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        <p className={`font-medium ${colores.text}`}>{titulo}</p>
        {children}
      </main>
    </div>
  );
}
