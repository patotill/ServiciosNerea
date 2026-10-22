import FormButton from "./components/buttons/formButton";
import LinkButton from "./components/buttons/linkButton";
import Card from "./components/containers/card";
import Container from "./components/containers/container";
import { Divider } from "./components/divider";
import { FormInput } from "./components/inputs/formInput";
import LinkText from "./components/text/linkText";
import Text from "./components/text/Text";
import Title from "./components/text/title";

export function App() {
  return (
    <Container fullScreen direction="column">
      <Card>
        <Title text="Servicios y Reparaciones NEREA"></Title>
        <form id="login-form" className="space-y-6">
          <FormInput
            id="email"
            placeholder="tu.email@gmail.com"
            required
            title="correo electrónico"
            type="email"
          ></FormInput>
          <FormInput
            id="password"
            placeholder="••••••••"
            required
            title="contraseña"
            type="password"
          ></FormInput>

          <FormButton color="blue" text="Iniciar sesión"></FormButton>
        </form>

        <Divider></Divider>

        <div className="mt-6 text-center">
          <Text>¿No tienes una cuenta? Regístrate como:</Text>

          <Container direction="row">
            <LinkButton href="/src/views/singUp/registro-cliente.html">
              Cliente
            </LinkButton>
            <LinkButton
              color="green"
              href="/src/views/singUp/registro-profesional.html"
            >
              Profesional
            </LinkButton>
          </Container>
        </div>
        <div className="mt-8 text-center">
          <LinkText href="/src/profile/admin.html">
            Ingresar como administrador
          </LinkText>
        </div>
      </Card>
    </Container>
  );
}
