import type { Reserva } from "../../types/reserva";
import { formatearFranja } from "../../utils/fechas";
import EstadoBadge from "./estadoBadge";

export default function ReservaCard({ reserva }: { reserva: Reserva }) {
  const { disponibilidad } = reserva;

  return (
    <article className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-start">
      <div>
        <h4 className="font-semibold text-slate-800">
          {reserva.servicio_categoria?.nombre ?? "Servicio"} ·{" "}
          <span className="font-normal capitalize">{reserva.tipo_reserva}</span>
        </h4>
        <p className="mt-1 text-sm text-slate-600">
          {reserva.descripcion_trabajo ?? "Sin descripción"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {disponibilidad
            ? formatearFranja(
                disponibilidad.fecha,
                disponibilidad.hora_inicio,
                disponibilidad.hora_fin,
              )
            : "Sin franja asignada"}
        </p>
      </div>
      <EstadoBadge estado={reserva.estado} />
    </article>
  );
}
