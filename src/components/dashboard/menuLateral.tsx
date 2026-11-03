import type { RefObject } from "react";
import { NavLink } from "react-router-dom";
import type { ItemMenu } from "../../config/menuPorRol";
import AppColors, { Neutros } from "../../utils/colors";

type MenuLateralProps = {
  abierto: boolean;
  onCerrar: () => void;
  menuRef: RefObject<HTMLElement | null>;
  botonCerrarRef: RefObject<HTMLButtonElement | null>;
  color: keyof typeof AppColors;
  items: ItemMenu[];
  onCerrarSesion: () => void;
  cerrandoSesion: boolean;
  errorLogout: boolean;
};

export default function MenuLateral({
  abierto,
  onCerrar,
  menuRef,
  botonCerrarRef,
  color,
  items,
  onCerrarSesion,
  cerrandoSesion,
  errorLogout,
}: MenuLateralProps) {
  const colores = AppColors[color];

  return (
    <>
      <div
        onClick={onCerrar}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity motion-reduce:transition-none ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={menuRef}
        id="menu-lateral"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!abierto}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform motion-reduce:transition-none ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex items-start justify-between gap-2 border-b ${Neutros.borde} p-4`}>
          <div>
            <p className={`text-2xl font-bold ${colores.text}`}>NEREA</p>
            <p className={`text-sm ${Neutros.texto}`}>Servicios y Reparaciones</p>
          </div>
          <button
            ref={botonCerrarRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar menú"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 ${Neutros.texto} ${Neutros.foco}`}
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

        <nav aria-label="Secciones" className="p-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCerrar}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-lg px-3 hover:bg-slate-100 ${Neutros.foco} ${
                  isActive
                    ? `bg-slate-100 font-bold ${colores.text}`
                    : `font-medium ${Neutros.texto}`
                }`
              }
            >
              {item.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className={`mt-auto border-t ${Neutros.borde} p-4`}>
          {errorLogout && (
            <p role="alert" className={`mb-3 text-sm ${AppColors.red.text}`}>
              No se pudo cerrar la sesión. Probá de nuevo.
            </p>
          )}
          <button
            type="button"
            onClick={onCerrarSesion}
            disabled={cerrandoSesion}
            aria-busy={cerrandoSesion}
            className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors ${Neutros.foco} disabled:cursor-not-allowed disabled:opacity-50 ${colores.bg} ${colores.hover}`}
          >
            {cerrandoSesion ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
}
