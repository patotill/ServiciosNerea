import type { UsuarioAdmin } from "../../types/admin";
import { Neutros } from "../../utils/colors";
import { formatearFechaAlta } from "../../utils/fechas";
import Dialogo from "../containers/dialogo";
import BotonAccion from "./botonAccion";

type UsuarioDialogoProps = {
  /** null = cerrado. */
  usuario: UsuarioAdmin | null;
  onCerrar: () => void;
};

const NO_INFORMADO = "No informado";

export default function UsuarioDialogo({ usuario, onCerrar }: UsuarioDialogoProps) {
  const datos: [string, string][] = usuario
    ? [
        ["Nombre", usuario.nombre ?? NO_INFORMADO],
        ["Email", usuario.email],
        ["Teléfono", usuario.telefono ?? NO_INFORMADO],
        ["Código postal", usuario.codigo_postal ?? NO_INFORMADO],
        ["Rol", usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)],
        ["Estado", usuario.activo ? "Activa" : "Bloqueada"],
        ...(usuario.rol === "profesional"
          ? [["Servicios", usuario.servicios.join(", ") || "Sin servicios"] as [string, string]]
          : []),
        ["Fecha de alta", formatearFechaAlta(usuario.created_at)],
      ]
    : [];

  return (
    <Dialogo abierto={usuario !== null} titulo="Datos del usuario" onCerrar={onCerrar}>
      <dl className="mt-4 grid gap-3">
        {datos.map(([termino, valor]) => (
          <div key={termino}>
            <dt className={`text-sm font-semibold ${Neutros.textoSuave}`}>{termino}</dt>
            <dd className={`break-all ${Neutros.titulo}`}>{valor}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex justify-end">
        <BotonAccion texto="Cerrar" onClick={onCerrar} />
      </div>
    </Dialogo>
  );
}
