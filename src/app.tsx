import Container from "./components/containers/container";
import LoginForm from "./views/login/loginForm";

export function App() {
  return (
    <Container fullScreen direction="column">
      <LoginForm></LoginForm>
    </Container>
  );
}
