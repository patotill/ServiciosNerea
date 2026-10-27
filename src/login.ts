import { Supabase } from "./utils/supabase";

export function setupLogin() {
  const loginForm = document.getElementById("login-form") as HTMLFormElement;

  if (loginForm) {
    loginForm.onsubmit = async (event) => {
      event.preventDefault();

      const email = (document.getElementById("email") as HTMLInputElement).value;
      const password = (document.getElementById("password") as HTMLInputElement).value;

      // 1. Validamos las credenciales con Supabase Auth
      const response = await Supabase.login({ email, password });

      if (response && response.success && response.data?.user) {
        // Usamos la comprobación opcional para asegurar que response.data existe
        const userId = response.data.user.id;

        // 2. Consultamos la tabla 'profesional' (casteado a any para evitar el error de TableName)
        const profesionalesResponse = await Supabase.getAll("profesional" as any);

        // 3. Verificamos si el ID de usuario está en la columna 'id_usuario'
        const esProfesional = profesionalesResponse.data?.some(
          (prof: any) => prof.id_usuario === userId
        );

        // 4. Redirigimos al panel correspondiente
        if (esProfesional) {
          window.location.href = "/profesional";
        } else {
          window.location.href = "/cliente";
        }

      } else {
        alert("Error al iniciar sesión. Verifica tu correo y contraseña.");
      }
    };
  }
}