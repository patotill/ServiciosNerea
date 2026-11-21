import type {
  CategoriaAdmin,
  DatosCategoria,
  GestionReservaAdmin,
  MatriculaAdmin,
  ReservaAdmin,
  UsuarioAdmin,
} from "../types/admin";
import type { EstadoMatricula } from "../types/reserva";

// La sesión va en cookies HttpOnly: el backend valida el rol admin y consulta con el token.

async function pedir<T>(
  url: string,
  mensajeGenerico: string,
  metodo = "GET",
  cuerpo?: object,
): Promise<T> {
  const respuesta = await fetch(url, {
    method: metodo,
    credentials: "same-origin",
    ...(cuerpo && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    }),
  }).catch(() => null);

  const datos = (await respuesta?.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!respuesta?.ok || !datos) {
    throw new Error(datos?.error || mensajeGenerico);
  }
  return datos;
}

export async function obtenerUsuarios(): Promise<UsuarioAdmin[]> {
  const { usuarios } = await pedir<{ usuarios: UsuarioAdmin[] }>(
    "/api/admin/usuarios",
    "No se pudieron cargar los usuarios.",
  );
  return usuarios;
}

export async function cambiarActivoUsuario(idUsuario: string, activo: boolean) {
  await pedir("/api/admin/usuarios", "No se pudo actualizar la cuenta.", "PATCH", {
    id_usuario: idUsuario,
    activo,
  });
}

export async function obtenerCategorias(): Promise<CategoriaAdmin[]> {
  const { categorias } = await pedir<{ categorias: CategoriaAdmin[] }>(
    "/api/admin/categorias",
    "No se pudieron cargar las categorías.",
  );
  return categorias;
}

export async function crearCategoria({ nombre, descripcion }: DatosCategoria) {
  await pedir("/api/admin/categorias", "No se pudo crear la categoría.", "POST", {
    nombre,
    descripcion,
  });
}

export async function editarCategoria(
  idServicio: number,
  { nombre, descripcion }: DatosCategoria,
) {
  await pedir("/api/admin/categorias", "No se pudo guardar la categoría.", "PUT", {
    id_servicio: idServicio,
    nombre,
    descripcion,
  });
}

export async function borrarCategoria(idServicio: number) {
  await pedir(
    "/api/admin/categorias",
    "No se pudo borrar la categoría.",
    "DELETE",
    { id_servicio: idServicio },
  );
}

export async function obtenerMatriculas(): Promise<MatriculaAdmin[]> {
  const { matriculas } = await pedir<{ matriculas: MatriculaAdmin[] }>(
    "/api/admin/matriculas",
    "No se pudieron cargar las matrículas.",
  );
  return matriculas;
}

export async function cambiarEstadoMatricula(
  idMatricula: number,
  estado: Exclude<EstadoMatricula, "pendiente">,
) {
  await pedir(
    "/api/admin/matriculas",
    "No se pudo actualizar la matrícula.",
    "PATCH",
    { id_matricula: idMatricula, estado_verificacion: estado },
  );
}

export async function obtenerReservasAdmin(): Promise<ReservaAdmin[]> {
  const { reservas } = await pedir<{ reservas: ReservaAdmin[] }>(
    "/api/admin/reservas",
    "No se pudieron cargar las reservas.",
  );
  return reservas;
}

export async function obtenerTotalReservasAdmin(): Promise<number> {
  const { total } = await pedir<{ total: number }>(
    "/api/admin/reservas?total=true",
    "No se pudo cargar el total de reservas.",
  );
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error("El servidor devolvió un total de reservas inválido.");
  }
  return total;
}

export async function gestionarReservaAdmin(datos: GestionReservaAdmin) {
  await pedir(
    "/api/admin/reservas",
    "No se pudo actualizar la reserva.",
    "PATCH",
    datos,
  );
}

export async function eliminarReservaAdmin(idReserva: number) {
  await pedir(
    "/api/admin/reservas",
    "No se pudo eliminar la reserva.",
    "DELETE",
    { id_reserva: idReserva },
  );
}
