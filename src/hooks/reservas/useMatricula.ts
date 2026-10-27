import { useEffect, useState } from "react";
import { obtenerEstadoMatricula } from "../../services/reservaService";
import type { EstadoMatricula } from "../../types/reserva";

export default function useMatricula() {
  const [estado, setEstado] = useState<EstadoMatricula | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    obtenerEstadoMatricula()
      .then((valor) => activo && setEstado(valor))
      .catch(() => activo && setEstado(null))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return { estado, cargando };
}
