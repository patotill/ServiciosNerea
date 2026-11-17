import type {
  EstadoMatriculaPublica,
  FiltrosProfesionales,
  PaginaProfesionales,
  ProfesionalPublico,
} from "../types/profesional";
import { PROFESIONALES_POR_PAGINA } from "../types/profesional";
import { Supabase } from "../utils/supabase";

// bigint[] llega como string[] desde PostgREST
type FilaProfesional = Omit<ProfesionalPublico, "ids_servicio"> & {
  ids_servicio: string[] | null;
  estado_matricula: EstadoMatriculaPublica;
};

// % y _ del texto del usuario no deben actuar como comodines del ilike
const escaparLike = (texto: string) => texto.replace(/[\\%_]/g, "\\$&");

export async function obtenerProfesionales(
  { nombre, idServicio, codigoPostal, pagina }: FiltrosProfesionales,
  signal: AbortSignal,
): Promise<PaginaProfesionales> {
  const desde = (pagina - 1) * PROFESIONALES_POR_PAGINA;

  let consulta = Supabase.client
    .from("profesional_publico")
    .select(
      "id_profesional, nombre, descripcion, codigo_postal, ids_servicio, servicios, estado_matricula",
      { count: "exact" },
    )
    // id_profesional desempata nombres iguales para que ninguna fila se repita o se pierda entre páginas
    .order("nombre", { ascending: true })
    .order("id_profesional", { ascending: true })
    .range(desde, desde + PROFESIONALES_POR_PAGINA - 1)
    .abortSignal(signal);

  const nombreLimpio = nombre.trim();
  const cpLimpio = codigoPostal.trim();
  if (nombreLimpio) consulta = consulta.ilike("nombre", `%${escaparLike(nombreLimpio)}%`);
  if (idServicio !== null) consulta = consulta.contains("ids_servicio", [idServicio]);
  if (cpLimpio) consulta = consulta.ilike("codigo_postal", `${escaparLike(cpLimpio)}%`);

  const { data, count, error } = await consulta.returns<FilaProfesional[]>();

  // PGRST103: la página pedida queda más allá del último resultado; se trata como página vacía
  if (error?.code === "PGRST103") return { profesionales: [], total: 0 };
  if (error) {
    throw new Error("No se pudieron cargar los profesionales.");
  }

  return {
    profesionales: data.map((fila) => ({
      ...fila,
      ids_servicio: (fila.ids_servicio ?? []).map(Number),
      servicios: fila.servicios ?? [],
    })),
    total: count ?? 0,
  };
}
