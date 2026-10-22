import { useEffect, useState } from "react";
import { Supabase } from "../../utils/supabase";

export default function useServicios() {
  const [servicios, setServicios] = useState<Record<any, any>[]>([]);

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
