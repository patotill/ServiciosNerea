import { useOutletContext } from "react-router-dom";
import type { Usuario } from "../../services/authService";

/** Usuario que RutaProtegida ya validó; solo se usa dentro de una ruta protegida. */
export default function useUsuario() {
  return useOutletContext<Usuario>();
}
