export type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "cancelada"
  | "completada";

export type TipoReserva = "visita" | "trabajo";

export type EstadoMatricula = "pendiente" | "verificada" | "rechazada";

export type AccionRespuestaReserva = "aceptar" | "rechazar" | "completar";

export type ContactoClienteReserva = {
  nombre: string | null;
  email: string | null;
  telefono: string | null;
};

export type Reserva = {
  id_reserva: number;
  id_profesional: number;
  id_servicio: number;
  id_disponibilidad: number;
  tipo_reserva: TipoReserva;
  descripcion_trabajo: string | null;
  estado: EstadoReserva;
  fecha_creacion: string;
  servicio_categoria: { nombre: string | null } | null;
  disponibilidad: {
    id_disponibilidad: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  } | null;
  cliente?: ContactoClienteReserva | null;
};
