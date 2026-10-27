import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar el hook de navegación
import FormButton from "../../components/buttons/formButton";
import LinkButton from "../../components/buttons/linkButton";
import Card from "../../components/containers/card";
import Container from "../../components/containers/container";
import { Divider } from "../../components/divider";
import { FormInput } from "../../components/inputs/formInput";
import Text from "../../components/text/Text";
import Title from "../../components/text/title";
import { ROLE_ROUTES, ROUTES } from "../../router/routes";
import { loginUsuario } from "../../services/authService";

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 2. Instanciar el navigate

  async function onSubmit(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setErrorMsg("Debes completar todos los campos.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const usuario = await loginUsuario(email as string, password as string);

      navigate(ROLE_ROUTES[usuario.rol]);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al intentar loguearse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <Title
        title="Servicios y Reparaciones NEREA"
        subtitle="Ingresá a tu cuenta para continuar"
      />
      <form id="login-form" className="space-y-6" action={onSubmit}>
        {errorMsg && (
          <Text color="red" size="m">
            {errorMsg}
          </Text>
        )}
        <FormInput
          id="email"
          name="email"
          placeholder="tu.email@gmail.com"
          required
          title="correo electrónico"
          type="email"
        />
        <FormInput
          id="password"
          name="password"
          placeholder="••••••••"
          required
          title="contraseña"
          type="password"
        />

        <FormButton color="blue" text="Iniciar sesión" loading={loading} />
      </form>

      <Divider />

      <div className="mt-6 text-center">
        <Text>¿No tienes una cuenta? Regístrate como:</Text>

        <Container direction="row">
          <LinkButton href={ROUTES.REGISTRO_CLIENTE} color="blue">
            Cliente
          </LinkButton>
          <LinkButton color="green" href={ROUTES.REGISTRO_PROFESIONAL}>
            Profesional
          </LinkButton>
        </Container>
      </div>
    </Card>
  );
}

