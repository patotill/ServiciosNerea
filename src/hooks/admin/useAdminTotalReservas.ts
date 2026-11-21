import { useEffect, useState } from "react";
import { obtenerTotalReservasAdmin } from "../../services/adminService";

export default function useAdminTotalReservas() {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    obtenerTotalReservasAdmin()
      .then((cantidad) => {
        if (activo) setTotal(cantidad);
      })
      .catch((fallo: unknown) => {
        if (activo) {
          setError(
            fallo instanceof Error
              ? fallo.message
              : "No se pudo cargar el total de reservas.",
          );
        }
      })
    return () => {
      activo = false;
    };
  }, []);

  return { total, error };
}
