import type { EstadoMatricula } from "./reserva";
import type { Rol } from "./tables";

export const USUARIOS_POR_PAGINA = 10;

export type UsuarioAdmin = {
  id_usuario: string;
  nombre: string | null;
  email: string;
  rol: Rol;
  /** `false` = cuenta bloqueada (RF-16). */
  activo: boolean;
};

export type CategoriaAdmin = {
  id_servicio: number;
  nombre: string;
  descripcion: string | null;
};

export type DatosCategoria = {
  nombre: string;
  descripcion: string;
};

export type MatriculaAdmin = {
  id_matricula: number;
  numero: string;
  estado_verificacion: EstadoMatricula;
  servicio_categoria: { nombre: string | null } | null;
  profesional: { usuario: { nombre: string | null } | null } | null;
};
