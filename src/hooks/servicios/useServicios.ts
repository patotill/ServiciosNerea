import { useEffect, useState } from "react";
import type { Servicio } from "../../types/servicios";
import { Supabase } from "../../utils/supabase";

export default function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function call() {
      const data = await Supabase.obtenerServicios();

      setServicios(data.data ?? []);
      setError(!!data.error);
      setCargando(false);
    }
    call();
  }, []);

  return {
    servicios: servicios,
    cargando,
    error,
  };
}
