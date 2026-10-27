import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_ROUTES } from "../../router/routes";
import { registrarUsuario } from "../../services/authService";
import type { SignUpData } from "../../types/signup";

const campo = (formData: FormData, nombre: string) =>
  String(formData.get(nombre) ?? "").trim();

const datosBase = (formData: FormData) => ({
  nombre: campo(formData, "nombre"),
  email: campo(formData, "email"),
  telefono: campo(formData, "telefono"),
  codigo_postal: campo(formData, "codigo_postal"),
  password: String(formData.get("password") ?? ""),
});

export default function useSignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function registrar(datos: SignUpData) {
    setLoading(true);
    setError(null);
    try {
      await registrarUsuario(datos);
      navigate(ROLE_ROUTES[datos.rol]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    registrarCliente: (formData: FormData) =>
      registrar({ ...datosBase(formData), rol: "cliente" }),
    registrarProfesional: (formData: FormData, servicios: number[]) =>
      registrar({
        ...datosBase(formData),
        rol: "profesional",
        servicios,
        matricula: campo(formData, "matricula") || undefined,
      }),
  };
}
