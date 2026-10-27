import { useEffect, useState } from "react";
import type { Servicio } from "../../types/servicios";
import { Supabase } from "../../utils/supabase";

export default function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    async function call() {
      const data = await Supabase.obtenerServicios();

      setServicios(data.data ?? []);
    }
    call();
  }, []);

  return {
    servicios: servicios,
  };
}
