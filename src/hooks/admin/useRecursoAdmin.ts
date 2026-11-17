import { useEffect, useState } from "react";

/**
 * Carga una lista del panel admin y ejecuta acciones sobre ella con el mismo
 * manejo de cargando/error. `cargar` debe ser una función estable (de services/).
 */
export default function useRecursoAdmin<T>(cargar: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    cargar()
      .then((datos) => activo && setItems(datos))
      .catch((e: unknown) => activo && setError(mensaje(e)))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [cargar]);

  /** Corre la acción y recarga la lista; devuelve si salió bien. */
  async function ejecutar(accion: () => Promise<void>): Promise<boolean> {
    setOcupado(true);
    setError(null);
    try {
      await accion();
      setItems(await cargar());
      return true;
    } catch (e) {
      setError(mensaje(e));
      return false;
    } finally {
      setOcupado(false);
    }
  }

  return { items, cargando, ocupado, error, ejecutar };
}

function mensaje(e: unknown) {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado.";
}
