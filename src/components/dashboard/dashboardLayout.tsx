import type { PropsWithChildren } from "react";
import { MENU_POR_ROL } from "../../config/menuPorRol";
import useUsuario from "../../hooks/sesion/useUsuario";
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
  const colores = AppColors[color];

  return (
    <div className="min-h-screen bg-slate-50">
      <EncabezadoConMenu color={color} items={MENU_POR_ROL[usuario.rol]} conLogout>
        Hola, {usuario.nombre ?? "bienvenido"}
      </EncabezadoConMenu>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        <p className={`font-medium ${colores.text}`}>{titulo}</p>
        {children}
      </main>
    </div>
  );
}
