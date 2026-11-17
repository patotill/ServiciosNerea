import {
  cambiarEstadoMatricula,
  obtenerMatriculas,
} from "../../services/adminService";
import useRecursoAdmin from "./useRecursoAdmin";

/** RF-18: revisar matrículas (verificar o rechazar). */
export default function useAdminMatriculas() {
  const { items, ejecutar, ...estado } = useRecursoAdmin(obtenerMatriculas);

  return {
    matriculas: items,
    ...estado,
    verificar: (idMatricula: number) =>
      ejecutar(() => cambiarEstadoMatricula(idMatricula, "verificada")),
    rechazar: (idMatricula: number) =>
      ejecutar(() => cambiarEstadoMatricula(idMatricula, "rechazada")),
  };
}
