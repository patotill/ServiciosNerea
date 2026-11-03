import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ROLE_HOME } from "../../router/routes";
import type { Rol } from "../../types/tables";
import AppColors, { Neutros } from "../../utils/colors";

const ETIQUETA_ROL: Record<Rol, string> = {
  cliente: "clientes",
  profesional: "profesionales",
  admin: "administradores",
};

type AccesoRestringidoProps = {
  rolesPermitidos: Rol[];
  rolActual: Rol;
};

export default function AccesoRestringido({
  rolesPermitidos,
  rolActual,
}: AccesoRestringidoProps) {
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
      <section
        role="alert"
        className={`w-full rounded-lg border bg-white p-6 ${AppColors.red.border}`}
      >
        <svg
          className={`h-10 w-10 ${AppColors.red.text}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3L2 21h20L12 3z" />
          <path d="M12 10v5M12 18h.01" />
        </svg>
        <h1
          ref={titulo}
          tabIndex={-1}
          className={`mt-3 text-xl font-bold outline-none ${AppColors.red.text}`}
        >
          Acceso restringido
        </h1>
        <p className={`mt-2 ${Neutros.texto}`}>
          Esta pantalla es solo para{" "}
          {rolesPermitidos.map((rol) => ETIQUETA_ROL[rol]).join(" y ")}. Tu
          cuenta es de {ETIQUETA_ROL[rolActual]}.
        </p>
        <Link
          to={ROLE_HOME[rolActual]}
          className={`mt-5 block w-full rounded-lg px-4 py-3 text-center font-semibold text-white ${Neutros.foco} ${AppColors.blue.bg} ${AppColors.blue.hover}`}
        >
          Ir a mi inicio
        </Link>
      </section>
    </main>
  );
}
