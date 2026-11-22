import type { EstadoReserva } from "./reserva";

export type DuracionTurno = 60 | 120 | 180;

export type Disponibilidad = {
  id_disponibilidad: number;
  id_profesional: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  retirada: boolean;
};

export type ProfesionalParaReserva = {
  id_profesional: number;
  nombre: string;
  ids_servicio: number[];
  servicios: string[];
};

export type ReservaCreada = {
  id_reserva: number;
  estado: Extract<EstadoReserva, "pendiente">;
};
