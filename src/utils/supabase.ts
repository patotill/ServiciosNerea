
import { createClient } from "@supabase/supabase-js";
import type { TableName } from "../types/tables";
import type { SignUpData } from "../types/signup";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export class Supabase {
  private static client = createClient(supabaseUrl, supabaseKey);

  // Obtener todos los registros de una tabla
  static async getAll(tableName: TableName) {
    return this.client.from(tableName).select("*");
  }

  // Iniciar sesión
  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { data, error } =
      await this.client.auth.signInWithPassword({
        email,
        password,
      });

    return { data, error };
  }

  // Registrar un cliente o profesional
  static async signUp({
    nombre,
    email,
    telefono,
    codigo_postal,
    password,
    rol,
  }: SignUpData) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
          codigo_postal,
          rol,
        },
      },
    });

    return { data, error };
  }

  // Obtener las especialidades disponibles
  static async obtenerServicios() {
    const { data, error } = await this.client
      .from("servicio_categoria")
      .select("id_servicio, nombre, descripcion")
      .order("nombre", { ascending: true });

    return { data, error };
  }

  // Obtener el perfil del profesional autenticado
  static async obtenerProfesionalActual() {
    const { data: authData, error: authError } =
      await this.client.auth.getUser();

    if (authError) {
      return { data: null, error: authError };
    }

    if (!authData.user) {
      return {
        data: null,
        error: new Error("No hay un usuario autenticado"),
      };
    }

    const { data, error } = await this.client
      .from("profesional")
      .select("id_profesional, id_usuario, descripcion")
      .eq("id_usuario", authData.user.id)
      .single();

    return { data, error };
  }

  // Asociar una especialidad a un profesional
  static async asociarServicioProfesional(
    idProfesional: number,
    idServicio: number
  ) {
    const { data, error } = await this.client
      .from("profesional_servicio")
      .insert({
        id_profesional: idProfesional,
        id_servicio: idServicio,
      })
      .select();

    return { data, error };
  }

  // Registrar una matrícula profesional
  static async registrarMatricula(
    idProfesional: number,
    idServicio: number,
    numero: string
  ) {
    const { data, error } = await this.client
      .from("matricula")
      .insert({
        id_profesional: idProfesional,
        id_servicio: idServicio,
        numero: numero.trim(),
        estado_verificacion: "pendiente",
      })
      .select();

    return { data, error };
  }
}
