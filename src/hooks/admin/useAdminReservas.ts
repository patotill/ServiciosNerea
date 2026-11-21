import {
  eliminarReservaAdmin,
  gestionarReservaAdmin,
  obtenerReservasAdmin,
} from "../../services/adminService";
import type { GestionReservaAdmin } from "../../types/admin";
import useRecursoAdmin from "./useRecursoAdmin";

export default function useAdminReservas() {
  const { items, ejecutar, ...estado } = useRecursoAdmin(obtenerReservasAdmin);

  return {
    reservas: items,
    ...estado,
    gestionar: (datos: GestionReservaAdmin) =>
      ejecutar(() => gestionarReservaAdmin(datos)),
    eliminar: (idReserva: number) =>
      ejecutar(() => eliminarReservaAdmin(idReserva)),
  };
}
