import Container from "./components/containers/container";
import LayoutPublico from "./components/layout/layoutPublico";
import LoginForm from "./views/login/loginForm";

export function App() {
  return (
    <LayoutPublico titulo="Iniciar sesión">
      <Container direction="column" gap="gap-4">
        <LoginForm></LoginForm>
      </Container>
    </LayoutPublico>
  );
}
