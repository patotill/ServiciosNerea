import { useEffect, useState } from "react";
import { usuarioActual, type Usuario } from "../../services/authService";

export default function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    usuarioActual()
      .then((valor) => activo && setUsuario(valor))
      .catch(() => activo && setUsuario(null))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return { usuario, cargando };
}
