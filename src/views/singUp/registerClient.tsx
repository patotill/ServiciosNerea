import FormButton from "../../components/buttons/formButton";
import Card from "../../components/containers/card";
import Container from "../../components/containers/container";
import { FormInput } from "../../components/inputs/formInput";
import LinkText from "../../components/text/linkText";
import Title from "../../components/text/title";
import { ROUTES } from "../../router/routes";

export default function RegisterClient() {
  return (
    <Container direction="column" fullScreen gap="gap-4">
      <Card>
        <Title
          title="Crear cuenta de Cliente"
          subtitle="Completa tus datos para registrarte"
        ></Title>

        <form id="registro-cliente-form" className="space-y-4">
          <FormInput
            title="Nombre"
            id="nombre"
            required
            type="text"
          ></FormInput>

          <FormInput title="Email" id="email" required type="text"></FormInput>

          <Container direction="row">
            <FormInput
              title="Teléfono"
              id="telefono"
              required
              type="tel"
            ></FormInput>
            <FormInput
              title="Código postal"
              id="CP"
              required
              type="text"
            ></FormInput>
          </Container>

          <FormInput
            title="Contraseña"
            id="password"
            required
            type="password"
          ></FormInput>

          <FormButton text="Registrarme como Cliente" color="blue"></FormButton>
        </form>

        <Container direction="row" gap="gap-2">
          ¿Ya tienes una cuenta?
          <LinkText href={ROUTES.LOGIN} color="blue">
            Inicia sesión
          </LinkText>
        </Container>
      </Card>
    </Container>
  );
}
