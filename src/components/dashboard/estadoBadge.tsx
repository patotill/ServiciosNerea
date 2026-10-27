import type { EstadoReserva } from "../../types/reserva";
import AppColors from "../../utils/colors";

const COLOR_ESTADO: Record<EstadoReserva, keyof typeof AppColors> = {
  pendiente: "gray",
  confirmada: "blue",
  completada: "green",
  rechazada: "red",
  cancelada: "red",
};

export default function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-sm font-medium capitalize text-white ${AppColors[COLOR_ESTADO[estado]].bg}`}
    >
      {estado}
    </span>
  );
}
