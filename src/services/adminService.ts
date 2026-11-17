import type {
  CategoriaAdmin,
  DatosCategoria,
  MatriculaAdmin,
  UsuarioAdmin,
} from "../types/admin";
import type { EstadoMatricula } from "../types/reserva";
import { Supabase } from "../utils/supabase";

// Las políticas RLS dan acceso total solo al admin (es_admin()); acá no se valida el rol.

/** Un update/delete bloqueado por RLS no devuelve error sino cero filas. */
function exigirFilas(filas: unknown[] | null, mensaje: string) {
  if (!filas || filas.length === 0) throw new Error(mensaje);
}

export async function obtenerUsuarios(): Promise<UsuarioAdmin[]> {
  const { data, error } = await Supabase.client
    .from("usuario")
    .select("id_usuario, nombre, email, rol, activo")
    .order("nombre", { ascending: true })
    .returns<UsuarioAdmin[]>();

  if (error) throw new Error("No se pudieron cargar los usuarios.");
  return data;
}

export async function cambiarActivoUsuario(idUsuario: string, activo: boolean) {
  const { data, error } = await Supabase.client
    .from("usuario")
    .update({ activo })
    .eq("id_usuario", idUsuario)
    .select("id_usuario");

  if (error) throw new Error("No se pudo actualizar la cuenta.");
  exigirFilas(data, "No se pudo actualizar la cuenta.");
}

export async function obtenerCategorias(): Promise<CategoriaAdmin[]> {
  const { data, error } = await Supabase.client
    .from("servicio_categoria")
    .select("id_servicio, nombre, descripcion")
    .order("nombre", { ascending: true })
    .returns<CategoriaAdmin[]>();

  if (error) throw new Error("No se pudieron cargar las categorías.");
  return data;
}

const limpiarCategoria = ({ nombre, descripcion }: DatosCategoria) => ({
  nombre: nombre.trim(),
  descripcion: descripcion.trim() || null,
});

export async function crearCategoria(datos: DatosCategoria) {
  const { error } = await Supabase.client
    .from("servicio_categoria")
    .insert(limpiarCategoria(datos));

  if (error) throw new Error("No se pudo crear la categoría.");
}

export async function editarCategoria(idServicio: number, datos: DatosCategoria) {
  const { data, error } = await Supabase.client
    .from("servicio_categoria")
    .update(limpiarCategoria(datos))
    .eq("id_servicio", idServicio)
    .select("id_servicio");

  if (error) throw new Error("No se pudo guardar la categoría.");
  exigirFilas(data, "No se pudo guardar la categoría.");
}

const FK_VIOLATION = "23503";

export async function borrarCategoria(idServicio: number) {
  const { data, error } = await Supabase.client
    .from("servicio_categoria")
    .delete()
    .eq("id_servicio", idServicio)
    .select("id_servicio");

  if (error?.code === FK_VIOLATION) {
    throw new Error(
      "No se puede borrar: hay reservas, matrículas o profesionales que usan esta categoría.",
    );
  }
  if (error) throw new Error("No se pudo borrar la categoría.");
  exigirFilas(data, "No se pudo borrar la categoría.");
}

export async function obtenerMatriculas(): Promise<MatriculaAdmin[]> {
  const { data, error } = await Supabase.client
    .from("matricula")
    .select(
      "id_matricula, numero, estado_verificacion, servicio_categoria(nombre), profesional(usuario(nombre))",
    )
    .order("id_matricula", { ascending: false })
    .returns<MatriculaAdmin[]>();

  if (error) throw new Error("No se pudieron cargar las matrículas.");
  return data;
}

export async function cambiarEstadoMatricula(
  idMatricula: number,
  estado: Exclude<EstadoMatricula, "pendiente">,
) {
  const { data, error } = await Supabase.client
    .from("matricula")
    .update({ estado_verificacion: estado })
    .eq("id_matricula", idMatricula)
    .select("id_matricula");

  if (error) throw new Error("No se pudo actualizar la matrícula.");
  exigirFilas(data, "No se pudo actualizar la matrícula.");
}
