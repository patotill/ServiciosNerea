// LÓGICA DEL REGISTRO DE CLIENTE
const registroClienteForm = document.getElementById(
  "registro-cliente-form",
) as HTMLFormElement;

if (registroClienteForm) {
  registroClienteForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const nombre = (document.getElementById("nombre") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const telefono = (document.getElementById("telefono") as HTMLInputElement)
      .value;
    const cp = (document.getElementById("cp") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    console.log("Intentando registrar cliente con:", {
      nombre,
      email,
      telefono,
      cp,
      password,
    });
  });
}

// LÓGICA DEL REGISTRO DE PROFESIONAL
const registroProfesionalForm = document.getElementById(
  "registro-profesional-form",
) as HTMLFormElement;

if (registroProfesionalForm) {
  registroProfesionalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = (document.getElementById("nombre-prof") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email-prof") as HTMLInputElement)
      .value;
    const telefono = (
      document.getElementById("telefono-prof") as HTMLInputElement
    ).value;
    const cp = (document.getElementById("cp-prof") as HTMLInputElement).value;
    const especialidad = (
      document.getElementById("especialidad") as HTMLInputElement
    ).value;
    const matricula = (document.getElementById("matricula") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("password-prof") as HTMLInputElement
    ).value;

    console.log("Intentando registrar profesional con:", {
      nombre,
      email,
      telefono,
      cp,
      especialidad,
      matricula,
      password,
    });
  });
}
