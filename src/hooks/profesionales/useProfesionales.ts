import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { obtenerProfesionales } from "../../services/profesionalService";
import { PROFESIONALES_POR_PAGINA, type ProfesionalPublico } from "../../types/profesional";

const DEBOUNCE_MS = 300;

type Resultado = {
  clave: string;
  profesionales: ProfesionalPublico[];
  total: number;
  error: string | null;
};

function enteroPositivo(valor: string | null): number | null {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function useTextoConDebounce(texto: string) {
  const [debounced, setDebounced] = useState(texto);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(texto), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [texto]);
  return debounced;
}

export default function useProfesionales() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nombre, setNombre] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const idServicio = enteroPositivo(searchParams.get("rubro"));
  const pagina = enteroPositivo(searchParams.get("pagina")) ?? 1;

  const nombreBuscado = useTextoConDebounce(nombre);
  const cpBuscado = useTextoConDebounce(codigoPostal);

  const clave = JSON.stringify([nombreBuscado, idServicio, cpBuscado, pagina, intento]);

  useEffect(() => {
    const controlador = new AbortController();
    obtenerProfesionales(
      { nombre: nombreBuscado, idServicio, codigoPostal: cpBuscado, pagina },
      controlador.signal,
    )
      .then(({ profesionales, total }) => {
        if (!controlador.signal.aborted) setResultado({ clave, profesionales, total, error: null });
      })
      .catch((e: unknown) => {
        if (controlador.signal.aborted) return;
        const error = e instanceof Error ? e.message : "No se pudieron cargar los profesionales.";
        setResultado({ clave, profesionales: [], total: 0, error });
      });
    return () => controlador.abort();
  }, [clave, nombreBuscado, idServicio, cpBuscado, pagina]);

  const fijarPagina = (n: number, reemplazar: boolean) => {
    setSearchParams(
      (previos) => {
        const siguientes = new URLSearchParams(previos);
        if (n === 1) siguientes.delete("pagina");
        else siguientes.set("pagina", String(n));
        return siguientes;
      },
      { replace: reemplazar },
    );
  };

  // Al cambiar un filtro la página vieja ya no tiene sentido: se vuelve a la primera.
  const reiniciarPagina = () => {
    if (pagina > 1) fijarPagina(1, true);
  };

  const cambiarRubro = (id: number | null) => {
    setSearchParams(
      (previos) => {
        const siguientes = new URLSearchParams(previos);
        if (id === null) siguientes.delete("rubro");
        else siguientes.set("rubro", String(id));
        siguientes.delete("pagina");
        return siguientes;
      },
      { replace: true },
    );
  };

  // Un resultado de otra clave es una respuesta vieja o pendiente: se muestra como carga.
  const vigente = resultado?.clave === clave ? resultado : null;

  // Una página sin filas más allá de la primera (p. ej. ?pagina=99 a mano) se corrige sin mostrar error.
  const paginaVacia = vigente !== null && !vigente.error && vigente.profesionales.length === 0;
  useEffect(() => {
    if (paginaVacia && pagina > 1) fijarPagina(1, true);
  }, [paginaVacia, pagina]);

  return {
    nombre,
    setNombre: (texto: string) => {
      setNombre(texto);
      reiniciarPagina();
    },
    codigoPostal,
    setCodigoPostal: (texto: string) => {
      setCodigoPostal(texto);
      reiniciarPagina();
    },
    idServicio,
    cambiarRubro,
    cargando: vigente === null,
    error: vigente?.error ?? null,
    profesionales: vigente?.profesionales ?? [],
    pagina,
    totalPaginas: Math.ceil((vigente?.total ?? 0) / PROFESIONALES_POR_PAGINA),
    cambiarPagina: (n: number) => fijarPagina(n, false),
    reintentar: () => setIntento((n) => n + 1),
  };
}
