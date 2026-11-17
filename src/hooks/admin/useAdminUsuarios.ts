import { cambiarActivoUsuario, obtenerUsuarios } from "../../services/adminService";
import useRecursoAdmin from "./useRecursoAdmin";

/** RF-16: listar usuarios y bloquear/habilitar cuentas. */
export default function useAdminUsuarios() {
  const { items, ejecutar, ...estado } = useRecursoAdmin(obtenerUsuarios);

  return {
    usuarios: items,
    ...estado,
    cambiarActivo: (idUsuario: string, activo: boolean) =>
      ejecutar(() => cambiarActivoUsuario(idUsuario, activo)),
  };
}
