import type { EstadoMatricula, EstadoReserva } from "../../types/reserva";
import AppColors from "../../utils/colors";

export type EstadoVisible = EstadoReserva | EstadoMatricula | "activa" | "bloqueada";

const COLOR_ESTADO: Record<EstadoVisible, keyof typeof AppColors> = {
  pendiente: "gray",
  confirmada: "blue",
  completada: "green",
  verificada: "green",
  activa: "green",
  rechazada: "red",
  cancelada: "red",
  bloqueada: "red",
};

export default function EstadoBadge({ estado }: { estado: EstadoVisible }) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-sm font-medium capitalize text-white ${AppColors[COLOR_ESTADO[estado]].bg}`}
    >
      {estado}
    </span>
  );
}
