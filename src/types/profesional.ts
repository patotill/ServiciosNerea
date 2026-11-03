export type EstadoMatriculaPublica = "verificada" | "pendiente" | "sin_matricula";

/** Registro de la vista pública `profesional_publico` (sin teléfono ni mail). */
export type ProfesionalPublico = {
  id_profesional: number;
  nombre: string;
  descripcion: string | null;
  codigo_postal: string | null;
  ids_servicio: number[];
  servicios: string[];
  estado_matricula: EstadoMatriculaPublica;
};

export const PROFESIONALES_POR_PAGINA = 12;

export type FiltrosProfesionales = {
  nombre: string;
  idServicio: number | null;
  codigoPostal: string;
  pagina: number;
};

export type PaginaProfesionales = {
  profesionales: ProfesionalPublico[];
  total: number;
};
