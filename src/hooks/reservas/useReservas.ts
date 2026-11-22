import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerReservas } from "../../services/reservaService";
import type { Reserva } from "../../types/reserva";

export default function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const montado = useRef(false);
  const solicitud = useRef(0);

  const cargar = useCallback(async () => {
    const idSolicitud = ++solicitud.current;
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerReservas();
      if (montado.current && solicitud.current === idSolicitud) {
        setReservas(datos);
      }
    } catch (e: unknown) {
      if (montado.current && solicitud.current === idSolicitud) {
        setError(
          e instanceof Error
            ? e.message
            : "No se pudieron cargar las reservas.",
        );
      }
    } finally {
      if (montado.current && solicitud.current === idSolicitud) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    montado.current = true;
    void cargar();
    return () => {
      montado.current = false;
      solicitud.current += 1;
    };
  }, [cargar]);

  return { reservas, cargando, error, recargar: cargar };
}
