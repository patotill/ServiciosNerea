import { Navigate, Outlet } from "react-router-dom";
import useSesion from "../../hooks/sesion/useSesion";
import { ROUTES } from "../../router/routes";
import type { Rol } from "../../types/tables";
import AppColors, { Neutros } from "../../utils/colors";
import AccesoRestringido from "./accesoRestringido";

type RutaProtegidaProps = {
  roles: Rol[];
};

/**
 * Sin sesión vuelve al login; con un rol no permitido no renderiza la pantalla
 * y muestra el aviso de acceso restringido. Es solo control de UI: la seguridad
 * de los datos depende de las políticas RLS de Supabase.
 */
export default function RutaProtegida({ roles }: RutaProtegidaProps) {
  const { usuario, cargando, error } = useSesion();

  if (cargando) {
    return <p role="status" className="p-6 text-slate-600">Cargando…</p>;
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
        <section role="alert" className="w-full">
          <p className={`font-bold ${AppColors.red.text}`}>
            No pudimos verificar tu sesión.
          </p>
          <p className={`mt-1 ${Neutros.texto}`}>
            Revisá tu conexión y probá de nuevo.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`mt-4 w-full rounded-lg px-4 py-3 font-semibold text-white ${Neutros.foco} ${AppColors.blue.bg} ${AppColors.blue.hover}`}
          >
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!roles.includes(usuario.rol)) {
    return <AccesoRestringido rolesPermitidos={roles} rolActual={usuario.rol} />;
  }

  return <Outlet context={usuario} />;
}
