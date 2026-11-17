import { useEffect, useState } from "react";
import { usuarioActual, type Usuario } from "../../services/authService";

export default function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    usuarioActual()
      .then((valor) => activo && setUsuario(valor))
      .catch(() => activo && setError(true))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return { usuario, cargando, error };
}
