import FormButton from "../../components/buttons/formButton";
import Card from "../../components/containers/card";
import Container from "../../components/containers/container";
import DropdownInput from "../../components/inputs/dropdownInput";
import { FormInput } from "../../components/inputs/formInput";
import LinkText from "../../components/text/linkText";
import Title from "../../components/text/title";
import useServicios from "../../hooks/servicios/useServicios";

export default function RegisterProfesional() {
  const { servicios } = useServicios();
  return (
    <Container direction="column" fullScreen gap="gap-4">
      <Card color="green">
        <Title
          title="Cuenta de profesional"
          subtitle="Ofrece tus servicios en la plataforma"
          color="green"
        ></Title>

        <form id="registro-profesional-form" className="space-y-4">
          <FormInput
            id="nombre-prof"
            title="Nombre Completo"
            required
            color="green"
            type="text"
          ></FormInput>
          <FormInput
            id="email-prof"
            title="Correo Electrónico"
            required
            color="green"
            type="text"
          ></FormInput>

          <Container direction="row">
            <FormInput
              title="Teléfono"
              id="telefono-prof"
              required
              color="green"
              type="tel"
            ></FormInput>
            <FormInput
              title="Código Postal"
              id="cp-prof"
              required
              color="green"
              type="text"
            ></FormInput>
          </Container>

          <Container direction="row" gap="gap-4">
            <DropdownInput
              id="especialidades"
              label="Especialidad"
              required
              items={servicios.map((v) => v.nombre)}
              color="green"
            ></DropdownInput>
            <FormInput
              title="Nº Matrícula"
              color="green"
              id="matricula"
              required
              placeholder="Opcional"
              type="text"
            ></FormInput>
          </Container>

          <FormInput
            title="Contraseña"
            color="green"
            id="password"
            required
            type="password"
          ></FormInput>

          <FormButton
            color="green"
            text="Registrarme como Profesional"
          ></FormButton>
        </form>

        <Container direction="row" gap="gap-2">
          ¿Ya tienes una cuenta?
          <LinkText color="green" href="/">
            Inicia sesión
          </LinkText>
        </Container>
      </Card>
    </Container>
  );
}
