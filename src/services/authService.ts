
import type { SignUpData } from '../types/signup';
import type { Rol } from '../types/tables';
import { Supabase } from '../utils/supabase';

export interface Usuario {
  id_usuario: string;
  email: string;
  nombre: string | null;
  telefono: string | null;
  codigo_postal: string | null;
  rol: Rol;
  created_at?: string;
}

/**
 * Obtiene el usuario autenticado mediante la cookie HttpOnly.
 */
export async function usuarioActual(): Promise<Usuario | null> {
  const respuesta = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
  });

  if (respuesta.status === 401) {
    return null;
  }

  if (!respuesta.ok) {
    throw new Error('No se pudo consultar la sesión.');
  }

  const datos: { usuario: Usuario } = await respuesta.json();

  return datos.usuario;
}

/**
 * Inicia sesión mediante el backend.
 */
export async function loginUsuario(
  email: string,
  contrasena: string
): Promise<Usuario> {
  const respuesta = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      email,
      password: contrasena,
    }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);

    throw new Error(
      datos?.error ?? 'No se pudo iniciar sesión.'
    );
  }

  const usuario = await usuarioActual();

  if (!usuario) {
    throw new Error('No se pudo recuperar la sesión.');
  }

  return usuario;
}

const ERRORES_REGISTRO: Record<string, string> = {
  'User already registered': 'Ya existe una cuenta con ese email.',
};

/**
 * Mantiene el registro actual mediante Supabase.
 */
export async function registrarUsuario(
  datos: SignUpData
): Promise<void> {
  const { error } = await Supabase.signUp(datos);

  if (error) {
    throw new Error(
      ERRORES_REGISTRO[error.message] ??
      'No se pudo crear la cuenta.'
    );
  }
}

/**
 * Cierra sesión eliminando las cookies del navegador.
 */
export async function logout(): Promise<void> {
  const respuesta = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });

  if (!respuesta.ok) {
    throw new Error('Error al cerrar sesión.');
  }
}
