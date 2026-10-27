import { useState } from "react";
import FormButton from "../../components/buttons/formButton";
import Card from "../../components/containers/card";
import Container from "../../components/containers/container";
import DropdownInput from "../../components/inputs/dropdownInput";
import { FormInput } from "../../components/inputs/formInput";
import Text from "../../components/text/Text";
import LinkText from "../../components/text/linkText";
import Title from "../../components/text/title";
import useServicios from "../../hooks/servicios/useServicios";
import useSignUp from "../../hooks/signup/useSignUp";
import { ROUTES } from "../../router/routes";

export default function RegisterProfesional() {
  const { servicios } = useServicios();
  const { registrarProfesional, loading, error } = useSignUp();
  const [especialidades, setEspecialidades] = useState<number[]>([]);

  return (
    <Container direction="column" fullScreen gap="gap-4">
      <Card color="green">
        <Title
          title="Cuenta de profesional"
          subtitle="Ofrecé tus servicios en la plataforma"
          color="green"
        ></Title>

        <form
          id="registro-profesional-form"
          className="space-y-4"
          action={(formData) => registrarProfesional(formData, especialidades)}
        >
          {error && (
            <Text color="red" size="text-sm">
              {error}
            </Text>
          )}
          <FormInput
            id="nombre-prof"
            name="nombre"
            title="Nombre"
            required
            color="green"
            type="text"
          ></FormInput>
          <FormInput
            id="email-prof"
            name="email"
            title="Email"
            required
            color="green"
            type="email"
          ></FormInput>

          <Container direction="row">
            <FormInput
              title="Teléfono"
              id="telefono-prof"
              name="telefono"
              required
              color="green"
              type="tel"
            ></FormInput>
            <FormInput
              title="Código postal"
              id="cp-prof"
              name="codigo_postal"
              required
              color="green"
              type="text"
            ></FormInput>
          </Container>

          <Container direction="row" gap="gap-4">
            <DropdownInput
              id="especialidades"
              label="Especialidades"
              text="Elegí tus especialidades"
              required
              items={servicios.map((s) => ({
                value: s.id_servicio,
                label: s.nombre,
              }))}
              onChange={setEspecialidades}
              color="green"
            ></DropdownInput>
            <FormInput
              title="Nº Matrícula"
              color="green"
              id="matricula"
              placeholder="Opcional"
              type="text"
            ></FormInput>
          </Container>

          <FormInput
            title="Contraseña"
            color="green"
            id="password"
            required
            minLength={6}
            type="password"
          ></FormInput>

          <FormButton
            color="green"
            text="Registrarme como Profesional"
            loading={loading}
          ></FormButton>
        </form>

        <Container direction="row" gap="gap-2">
          ¿Ya tenés una cuenta?
          <LinkText color="green" href={ROUTES.LOGIN}>
            Iniciá sesión
          </LinkText>
        </Container>
      </Card>
    </Container>
  );
}
