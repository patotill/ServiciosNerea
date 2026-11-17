
import type { PropsWithChildren } from "react";
import {
  MENU_PUBLICO,
  NAVEGACION_PUBLICA,
  type ItemMenu,
} from "../../config/menuPorRol";
import useSesion from "../../hooks/sesion/useSesion";
import { ROLE_HOME } from "../../router/routes";
import EncabezadoConMenu from "./encabezadoConMenu";

type LayoutPublicoProps = PropsWithChildren<{ titulo: string }>;

/** Estructura de las vistas públicas. */
export default function LayoutPublico({
  titulo,
  children,
}: LayoutPublicoProps) {
  const { usuario } = useSesion();

  const items: ItemMenu[] = !usuario
    ? MENU_PUBLICO
    : usuario.rol === "admin"
      ? NAVEGACION_PUBLICA
      : [
          ...NAVEGACION_PUBLICA,
          { etiqueta: "Mi panel", to: ROLE_HOME[usuario.rol] },
        ];

  const destinoPanel =
    usuario && usuario.rol !== "admin"
      ? ROLE_HOME[usuario.rol]
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <EncabezadoConMenu
        color="blue"
        items={items}
        conLogout={!!usuario}
        conHome
        accesoPublico
        destinoPanel={destinoPanel}
      >
        {titulo === "Inicio" ? "ServiciosNerea" : titulo}
      </EncabezadoConMenu>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
