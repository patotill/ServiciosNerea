import type {
  ContactoClienteReserva,
  EstadoMatricula,
  Reserva,
} from "./reserva";
import type { Rol } from "./tables";

export const USUARIOS_POR_PAGINA = 10;

export type UsuarioAdmin = {
  id_usuario: string;
  nombre: string | null;
  email: string;
  telefono: string | null;
  codigo_postal: string | null;
  rol: Rol;
  /** `false` = cuenta bloqueada (RF-16). */
  activo: boolean;
  /** Nombres de las categorías del profesional; vacía para otros roles. */
  servicios: string[];
  /** Fecha de alta en ISO 8601. */
  created_at: string;
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

export type ReservaAdmin = Omit<Reserva, "cliente"> & {
  id_cliente: number;
  cliente: Pick<ContactoClienteReserva, "nombre" | "email"> | null;
  profesional: { nombre: string | null } | null;
};

export type GestionReservaAdmin =
  | {
      accion: "modificar";
      id_reserva: number;
      id_disponibilidad: number;
      descripcion_trabajo: string;
    }
  | {
      accion: "aceptar" | "rechazar";
      id_reserva: number;
    };
