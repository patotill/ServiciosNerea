import { useState } from "react";
import { USUARIOS_POR_PAGINA, type UsuarioAdmin } from "../../types/admin";
import AppColors, { Neutros } from "../../utils/colors";
import { FORMA_CONTROL } from "../../utils/estilos";
import Paginador from "../navigation/paginador";
import EstadoBadge from "../dashboard/estadoBadge";
import BotonAccion from "./botonAccion";
import UsuarioDialogo from "./usuarioDialogo";

type UsuariosAdminProps = {
  usuarios: UsuarioAdmin[];
  idPropio: string;
  ocupado: boolean;
  onCambiarActivo: (idUsuario: string, activo: boolean) => void;
};

// Mismas columnas en el encabezado y en cada fila: Usuario | Rol | Estado y acción | Datos.
const COLUMNAS = "sm:grid-cols-[minmax(0,1fr)_7rem_18rem_2.75rem]";

export default function UsuariosAdmin({
  usuarios,
  idPropio,
  ocupado,
  onCambiarActivo,
}: UsuariosAdminProps) {
  const [pagina, setPagina] = useState(1);
  // Se guarda el id y no el usuario, así el diálogo siempre muestra el dato actual de la lista.
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null);
  const seleccionado = usuarios.find((u) => u.id_usuario === idSeleccionado) ?? null;
  // Si la lista se achica (p. ej. tras bloquear) la página se mantiene dentro de rango.
  const totalPaginas = Math.max(1, Math.ceil(usuarios.length / USUARIOS_POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = usuarios.slice(
    (paginaActual - 1) * USUARIOS_POR_PAGINA,
    paginaActual * USUARIOS_POR_PAGINA,
  );

  return (
    <>
      <div
        aria-hidden="true"
        className={`hidden gap-3 border-b border-slate-100 pb-2 text-sm font-semibold sm:grid ${COLUMNAS} ${Neutros.texto}`}
      >
        <span>Usuario</span>
        <span>Rol</span>
        <div className="grid grid-cols-2 gap-3 text-center">
          <span>Estado</span>
          <span>Acción</span>
        </div>
        <span className="sr-only">Datos</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {visibles.map((u) => {
          const nombre = u.nombre ?? u.email;
          const esPropio = u.id_usuario === idPropio;

          return (
            <li
              key={u.id_usuario}
              className={`flex flex-col gap-3 py-3 sm:grid sm:items-center ${COLUMNAS}`}
            >
              <div className="min-w-0">
                <p className={`font-medium ${Neutros.titulo}`}>{nombre}</p>
                <p className={`break-all text-sm ${Neutros.textoSuave}`}>{u.email}</p>
              </div>
              <p className={`text-sm capitalize ${Neutros.textoSuave} sm:text-base`}>{u.rol}</p>
              {/* Dos columnas fijas: el estado y la acción quedan alineados en todas las filas. */}
              <div className="grid grid-cols-2 items-center gap-3">
                <div className="flex justify-center">
                  <EstadoBadge estado={u.activo ? "activa" : "bloqueada"} comoControl />
                </div>
                <div className="flex justify-center">
                  {esPropio ? (
                    <span className={`${FORMA_CONTROL} ${Neutros.textoSuave}`}>
                      Es tu cuenta
                    </span>
                  ) : (
                    <BotonAccion
                      texto={u.activo ? "Bloquear" : "Habilitar"}
                      etiqueta={`${u.activo ? "Bloquear" : "Habilitar"} a ${nombre}`}
                      color={u.activo ? "red" : "green"}
                      disabled={ocupado}
                      onClick={() => onCambiarActivo(u.id_usuario, !u.activo)}
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIdSeleccionado(u.id_usuario)}
                aria-label={`Ver datos de ${nombre}`}
                className={`inline-flex h-11 w-11 items-center justify-center self-end rounded-lg sm:self-auto ${AppColors.gray.text} ${AppColors.gray.linkHover} ${Neutros.foco}`}
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
      <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
      <UsuarioDialogo usuario={seleccionado} onCerrar={() => setIdSeleccionado(null)} />
    </>
  );
}
