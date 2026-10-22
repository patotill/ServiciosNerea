import { Supabase } from "./utils/supabase";

// LÓGICA DEL LOGIN
const loginForm = document.getElementById("login-form") as HTMLFormElement;

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    Supabase.login({ email, password }).then((response) =>
      console.log(response),
    );
  });
}
