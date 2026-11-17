import type { EstadoMatricula, EstadoReserva } from "../../types/reserva";
import AppColors from "../../utils/colors";
import { FORMA_CONTROL } from "../../utils/estilos";

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

type EstadoBadgeProps = {
  estado: EstadoVisible;
  /** Mismo tamaño que BotonAccion, pero con borde y sin relleno para no parecer clickeable. */
  comoControl?: boolean;
};

export default function EstadoBadge({ estado, comoControl }: EstadoBadgeProps) {
  const colores = AppColors[COLOR_ESTADO[estado]];
  const estilo = comoControl
    ? `${FORMA_CONTROL} border-2 bg-white ${colores.border} ${colores.text}`
    : `rounded-full px-3 py-1 text-sm font-medium text-white ${colores.bg}`;

  return <span className={`w-fit capitalize ${estilo}`}>{estado}</span>;
}
