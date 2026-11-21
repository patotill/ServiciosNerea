import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { MENU_POR_ROL } from "../../config/menuPorRol";
import useUsuario from "../../hooks/sesion/useUsuario";
import { ROLE_HOME } from "../../router/routes";
import AppColors from "../../utils/colors";
import EncabezadoConMenu from "../layout/encabezadoConMenu";

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
  const { pathname } = useLocation();
  const colores = AppColors[color];
  const rutaPanel = ROLE_HOME[usuario.rol];
  const destinoPanel = pathname === rutaPanel ? undefined : rutaPanel;
  const menu = MENU_POR_ROL[usuario.rol];
  const itemsMenu = destinoPanel
    ? [...menu, { etiqueta: "Mi panel", to: destinoPanel, end: true }]
    : menu;

  return (
    <div className="min-h-screen bg-slate-50">
      <EncabezadoConMenu
        color={color}
        items={itemsMenu}
        conLogout
        destinoPanel={destinoPanel}
      >
        Hola, {usuario.nombre ?? "bienvenido"}
      </EncabezadoConMenu>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        <p className={`font-medium ${colores.text}`}>{titulo}</p>
        {children}
      </main>
    </div>
  );
}
