
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ItemMenu } from "../../config/menuPorRol";
import useMenuLateral from "../../hooks/dashboard/useMenuLateral";
import useCerrarSesion from "../../hooks/sesion/useCerrarSesion";
import { ROUTES } from "../../router/routes";
import AppColors, { Neutros } from "../../utils/colors";
import MenuLateral from "../dashboard/menuLateral";

type EncabezadoConMenuProps = {
  color: keyof typeof AppColors;
  items: ItemMenu[];
  conLogout?: boolean;
  conHome?: boolean;
  accesoPublico?: boolean;
  destinoPanel?: string;
  children: ReactNode;
};

/** Barra superior con menú lateral y título central. */
export default function EncabezadoConMenu({
  color,
  items,
  conLogout = false,
  conHome = false,
  accesoPublico = false,
  destinoPanel,
  children,
}: EncabezadoConMenuProps) {
  const colores = AppColors[color];

  const { abierto, abrir, cerrar, botonMenu, botonCerrar, menu } =
    useMenuLateral();

  const { cerrarSesion, cerrandoSesion, errorLogout } =
    useCerrarSesion();

  return (
    <>
      <header
        className={`sticky top-0 z-30 grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-2 px-3 py-3 text-white shadow sm:gap-3 sm:px-6 ${colores.bg}`}
      >
        <button
          ref={botonMenu}
          type="button"
          onClick={abrir}
          aria-label="Abrir menú"
          aria-expanded={abierto}
          aria-controls="menu-lateral"
          className={`flex h-11 min-w-11 items-center justify-center gap-2 justify-self-start rounded-lg px-2 hover:bg-white/15 ${Neutros.focoClaro}`}
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

          <span className="hidden font-medium sm:inline">
            Menú
          </span>
        </button>

        <h1 className="min-w-0 truncate text-center text-base font-bold sm:text-2xl">
          {children}
        </h1>

        {accesoPublico ? (
          conLogout ? (
            destinoPanel ? (
              <Link
                to={destinoPanel}
                className={`inline-flex min-h-11 items-center justify-self-end rounded-lg border border-white px-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:px-3 sm:text-sm ${Neutros.focoClaro}`}
              >
                Mi panel
              </Link>
            ) : (
              <span className="justify-self-end text-sm font-semibold">
                NEREA
              </span>
            )
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className={`inline-flex min-h-11 items-center justify-self-end rounded-lg border border-white px-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:px-3 sm:text-sm ${Neutros.focoClaro}`}
            >
              Iniciar sesión
            </Link>
          )
        ) : conHome ? (
          <Link
            to={ROUTES.HOME}
            className={`inline-flex min-h-11 items-center justify-self-end rounded-lg text-lg font-bold tracking-wide ${Neutros.focoClaro}`}
          >
            NEREA
          </Link>
        ) : (
          <p className="justify-self-end text-lg font-bold tracking-wide">
            NEREA
          </p>
        )}
      </header>

      <MenuLateral
        abierto={abierto}
        onCerrar={cerrar}
        menuRef={menu}
        botonCerrarRef={botonCerrar}
        color={color}
        items={items}
        onCerrarSesion={conLogout ? cerrarSesion : undefined}
        cerrandoSesion={cerrandoSesion}
        errorLogout={errorLogout}
      />
    </>
  );
}
