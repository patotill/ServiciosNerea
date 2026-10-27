import FormButton from "../../components/buttons/formButton";
import Card from "../../components/containers/card";
import Container from "../../components/containers/container";
import { FormInput } from "../../components/inputs/formInput";
import Text from "../../components/text/Text";
import LinkText from "../../components/text/linkText";
import Title from "../../components/text/title";
import useSignUp from "../../hooks/signup/useSignUp";
import { ROUTES } from "../../router/routes";

export default function RegisterClient() {
  const { registrarCliente, loading, error } = useSignUp();

  return (
    <Container direction="column" fullScreen gap="gap-4">
      <Card>
        <Title
          title="Crear cuenta de Cliente"
          subtitle="Completá tus datos para registrarte"
        ></Title>

        <form
          id="registro-cliente-form"
          className="space-y-4"
          action={registrarCliente}
        >
          {error && (
            <Text color="red" size="text-sm">
              {error}
            </Text>
          )}
          <FormInput
            title="Nombre"
            id="nombre"
            required
            type="text"
          ></FormInput>

          <FormInput
            title="Email"
            id="email"
            required
            type="email"
          ></FormInput>

          <Container direction="row">
            <FormInput
              title="Teléfono"
              id="telefono"
              required
              type="tel"
            ></FormInput>
            <FormInput
              title="Código postal"
              id="codigo_postal"
              required
              type="text"
            ></FormInput>
          </Container>

          <FormInput
            title="Contraseña"
            id="password"
            required
            minLength={6}
            type="password"
          ></FormInput>

          <FormButton
            text="Registrarme como Cliente"
            color="blue"
            loading={loading}
          ></FormButton>
        </form>

        <Container direction="row" gap="gap-2">
          ¿Ya tenés una cuenta?
          <LinkText href={ROUTES.LOGIN} color="blue">
            Iniciá sesión
          </LinkText>
        </Container>
      </Card>
    </Container>
  );
}
