import { createClient } from "@supabase/supabase-js";
import { TableName } from "../types/tables";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export class Supabase {
  private static client = createClient(supabaseUrl, supabaseKey);

  static async getAll(tableName: TableName) {
    return this.client.from(tableName).select("*");
  }
  static async login({ email, password }: { email: string; password: string }) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error de login:", error.message);
    } else {
      // deberiamos guardar esto en los cookies
      console.log("Usuario:", data.user);
      console.log("Access token:", data.session.access_token);
    }
  }
}
