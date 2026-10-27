import { Supabase } from '../utils/supabase';

// Tipo de usuario basado en la tabla 'usuario'
export interface Usuario {
  id_usuario: string;
  email: string;
  nombre?: string;
  rol: 'cliente' | 'profesional' | 'admin';
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

/**
 * Login exclusivo para Administradores (/admin)
 */
export async function loginAdmin(email: string, contrasena: string): Promise<Usuario> {
  const usuario = await loginUsuario(email, contrasena);

  if (usuario.rol !== 'admin') {
    throw new Error('Acceso denegado. No tienes permisos de administrador.');
  }

  return usuario;
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