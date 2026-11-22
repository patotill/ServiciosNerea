import { Link } from "react-router-dom";
import type { MatriculaAdmin, UsuarioAdmin } from "../../types/admin";
import { ROUTES } from "../../router/routes";
import { Neutros } from "../../utils/colors";
import StatCard from "../dashboard/statCard";

type ResumenAdminProps = {
  usuarios: UsuarioAdmin[];
  matriculas: MatriculaAdmin[];
  totalCategorias: number;
  totalReservas: number | null;
};

export default function ResumenAdmin({
  usuarios,
  matriculas,
  totalCategorias,
  totalReservas,
}: ResumenAdminProps) {
  const porRol = (rol: UsuarioAdmin["rol"]) =>
    usuarios.filter((u) => u.rol === rol).length;

  return (
    <section
      aria-label="Resumen"
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <StatCard titulo="Clientes" valor={porRol("cliente")} color="blue" />
      <StatCard titulo="Profesionales" valor={porRol("profesional")} color="blue" />
      <Link
        to={ROUTES.ADMIN_RESERVAS}
        className={`block rounded-2xl no-underline ${Neutros.foco}`}
      >
        <StatCard
          titulo="Total de reservas"
          valor={totalReservas ?? "—"}
          color="red"
        />
      </Link>
      <Link
        to={ROUTES.ADMIN_MATRICULAS}
        className={`block rounded-2xl no-underline ${Neutros.foco}`}
      >
        <StatCard
          titulo="Matrículas pendientes"
          valor={
            matriculas.filter((m) => m.estado_verificacion === "pendiente")
              .length
          }
          color="gray"
        />
      </Link>
      <StatCard titulo="Categorías" valor={totalCategorias} color="green" />
    </section>
  );
}
