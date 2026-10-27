import type { Reserva } from "../types/reserva";

// Datos de ejemplo mientras Supabase no devuelva reservas; borrar cuando haya datos reales.
export const MOCK_RESERVAS: Reserva[] = [
  {
    id_reserva: 1,
    tipo_reserva: "visita",
    descripcion_trabajo: "Pérdida de agua en la cocina",
    estado: "pendiente",
    fecha_creacion: "2026-10-26T14:00:00Z",
    servicio_categoria: { nombre: "Plomería" },
    disponibilidad: { fecha: "2026-10-30", hora_inicio: "09:00", hora_fin: "10:00" },
  },
  {
    id_reserva: 2,
    tipo_reserva: "trabajo",
    descripcion_trabajo: "Cambio de tablero eléctrico",
    estado: "confirmada",
    fecha_creacion: "2026-10-24T10:30:00Z",
    servicio_categoria: { nombre: "Electricidad" },
    disponibilidad: { fecha: "2026-10-29", hora_inicio: "15:00", hora_fin: "18:00" },
  },
  {
    id_reserva: 3,
    tipo_reserva: "trabajo",
    descripcion_trabajo: "Pintura de living y pasillo",
    estado: "completada",
    fecha_creacion: "2026-10-15T09:00:00Z",
    servicio_categoria: { nombre: "Pintura" },
    disponibilidad: { fecha: "2026-10-20", hora_inicio: "08:00", hora_fin: "13:00" },
  },
];
