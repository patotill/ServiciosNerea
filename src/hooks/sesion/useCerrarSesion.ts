import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { logout } from "../../services/authService";

export default function useCerrarSesion() {
  const navigate = useNavigate();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);

  async function cerrarSesion() {
    setCerrandoSesion(true);
    setErrorLogout(false);
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      setErrorLogout(true);
      setCerrandoSesion(false);
    }
  }

  return { cerrarSesion, cerrandoSesion, errorLogout };
}
