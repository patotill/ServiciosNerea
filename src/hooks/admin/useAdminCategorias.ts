import {
  borrarCategoria,
  crearCategoria,
  editarCategoria,
  obtenerCategorias,
} from "../../services/adminService";
import type { DatosCategoria } from "../../types/admin";
import useRecursoAdmin from "./useRecursoAdmin";

/** RF-17: alta, edición y baja de categorías de servicio. */
export default function useAdminCategorias() {
  const { items, ejecutar, ...estado } = useRecursoAdmin(obtenerCategorias);

  return {
    categorias: items,
    ...estado,
    guardar: (datos: DatosCategoria, idServicio: number | null) =>
      ejecutar(() =>
        idServicio === null
          ? crearCategoria(datos)
          : editarCategoria(idServicio, datos),
      ),
    borrar: (idServicio: number) => ejecutar(() => borrarCategoria(idServicio)),
  };
}
