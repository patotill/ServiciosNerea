import { useEffect, useState } from "react";
import { MOCK_RESERVAS } from "../../data/mockReservas";
import { obtenerReservas } from "../../services/reservaService";
import type { Reserva } from "../../types/reserva";

export default function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [esMock, setEsMock] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    function usarMock() {
      setReservas(MOCK_RESERVAS);
      setEsMock(true);
    }

    obtenerReservas()
      .then((datos) => {
        if (!activo) return;
        if (datos.length > 0) setReservas(datos);
        else usarMock();
      })
      .catch(() => activo && usarMock())
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return { reservas, esMock, cargando };
}
