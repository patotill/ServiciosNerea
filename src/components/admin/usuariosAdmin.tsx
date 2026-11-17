import type { UsuarioAdmin } from "../../types/admin";
import { Neutros } from "../../utils/colors";
import { FORMA_CONTROL } from "../../utils/estilos";
import EstadoBadge from "../dashboard/estadoBadge";
import BotonAccion from "./botonAccion";

type UsuariosAdminProps = {
  usuarios: UsuarioAdmin[];
  idPropio: string;
  ocupado: boolean;
  onCambiarActivo: (idUsuario: string, activo: boolean) => void;
};

export default function UsuariosAdmin({
  usuarios,
  idPropio,
  ocupado,
  onCambiarActivo,
}: UsuariosAdminProps) {
  return (
    <ul className="divide-y divide-slate-100">
      {usuarios.map((u) => {
        const nombre = u.nombre ?? u.email;
        const esPropio = u.id_usuario === idPropio;

        return (
          <li
            key={u.id_usuario}
            className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className={`font-medium ${Neutros.titulo}`}>{nombre}</p>
              <p className={`break-all text-sm ${Neutros.textoSuave}`}>{u.email}</p>
              <p className={`text-sm capitalize ${Neutros.textoSuave}`}>{u.rol}</p>
            </div>
            {/* Dos columnas fijas: el estado y la acción quedan alineados en todas las filas. */}
            <div className="grid grid-cols-2 items-center gap-3 sm:w-72">
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
          </li>
        );
      })}
    </ul>
  );
}
