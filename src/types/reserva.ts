export type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "cancelada"
  | "completada";

export type TipoReserva = "visita" | "trabajo";

export type EstadoMatricula = "pendiente" | "verificada" | "rechazada";

export type Reserva = {
  id_reserva: number;
  tipo_reserva: TipoReserva;
  descripcion_trabajo: string | null;
  estado: EstadoReserva;
  fecha_creacion: string;
  servicio_categoria: { nombre: string | null } | null;
  disponibilidad: {
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  } | null;
};
