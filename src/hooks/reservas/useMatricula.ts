import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerEstadoMatricula } from "../../services/reservaService";
import type { EstadoMatricula } from "../../types/reserva";

export default function useMatricula() {
  const [estado, setEstado] = useState<EstadoMatricula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const solicitud = useRef(0);

  const recargar = useCallback(async () => {
    const idSolicitud = ++solicitud.current;
    setCargando(true);
    setError(null);
    try {
      const valor = await obtenerEstadoMatricula();
      if (solicitud.current === idSolicitud) setEstado(valor);
    } catch (e: unknown) {
      if (solicitud.current === idSolicitud) {
        setError(
          e instanceof Error ? e.message : "No se pudo consultar la matrícula.",
        );
      }
    } finally {
      if (solicitud.current === idSolicitud) setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
    return () => {
      solicitud.current += 1;
    };
  }, [recargar]);

  return { estado, cargando, error, recargar };
}
