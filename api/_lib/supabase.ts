
import { createClient } from "@supabase/supabase-js";

function obtenerConfiguracionSupabase() {
  const url = process.env.SUPABASE_URL;

  const clave =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!url || !clave) {
    throw new Error(
      "Falta configurar la URL o la clave pública de Supabase."
    );
  }

  return { url, clave };
}

/**
 * Crea un cliente independiente de Supabase para el backend.
 * No persiste ni renueva sesiones automáticamente.
 */
export function crearClienteSupabaseServidor(
  accessToken?: string
) {
  const { url, clave } = obtenerConfiguracionSupabase();

  return createClient(url, clave, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    ...(accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : {}),
  });
}
