import type { SignUpData } from '../types/signup';
import type { Rol } from '../types/tables';
import { Supabase } from '../utils/supabase';

// Tipo de usuario basado en la tabla 'usuario'
export interface Usuario {
  id_usuario: string;
  email: string;
  nombre?: string;
  rol: Rol;
  created_at?: string;
}

/**
 * Login general para todos los roles (cliente, profesional, admin)
 */
export async function loginUsuario(email: string, contrasena: string): Promise<Usuario> {
  // 1. Autenticar con Supabase Auth (correo y contraseña seguros)
  const { data: authData, error: authError } = await Supabase.client.auth.signInWithPassword({
    email,
    password: contrasena,
  });

  if (authError || !authData.user) {
    throw new Error('Credenciales incorrectas.');
  }

  // 2. Consultar el perfil y rol en la tabla 'usuario'
  const { data: usuario, error: dbError } = await Supabase.client
    .from('usuario')
    .select('*')
    .eq('id_usuario', authData.user.id)
    .single();

  if (dbError || !usuario) {
    throw new Error('No se encontró el perfil del usuario en la base de datos.');
  }

  return usuario as Usuario;
}

const ERRORES_REGISTRO: Record<string, string> = {
  'User already registered': 'Ya existe una cuenta con ese email.',
};

/**
 * Crea la cuenta de auth. El perfil completo lo crea el trigger
 * crear_usuario_desde_auth (supabase/crear_usuario_desde_auth.sql) en la misma transacción.
 */
export async function registrarUsuario(datos: SignUpData): Promise<void> {
  const { error } = await Supabase.signUp(datos);

  if (error) {
    throw new Error(ERRORES_REGISTRO[error.message] ?? 'No se pudo crear la cuenta.');
  }
}

/**
 * Cerrar sesión
 */
export async function logout(): Promise<void> {
  const { error } = await Supabase.client.auth.signOut();
  if (error) {
    throw new Error('Error al cerrar sesión.');
  }
}