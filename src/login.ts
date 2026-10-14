import { Supabase } from "./utils/supabase";

export function setupLogin() {
  const loginForm = document.getElementById("login-form") as HTMLFormElement;

  if (loginForm) {
    loginForm.onsubmit = async (event) => {
      event.preventDefault();

      const email = (document.getElementById("email") as HTMLInputElement).value;
      const password = (document.getElementById("password") as HTMLInputElement).value;

      const response = await Supabase.login({ email, password });

      if (response && response.success) {
        window.location.href = "/cliente"; 
      } else {
        alert("Error al iniciar sesión. Verifica tu correo y contraseña.");
      }
    };
  }
}