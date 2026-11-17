import type { MatriculaAdmin, UsuarioAdmin } from "../../types/admin";
import StatCard from "../dashboard/statCard";

type ResumenAdminProps = {
  usuarios: UsuarioAdmin[];
  matriculas: MatriculaAdmin[];
  totalCategorias: number;
};

export default function ResumenAdmin({
  usuarios,
  matriculas,
  totalCategorias,
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
      <StatCard titulo="Administradores" valor={porRol("admin")} color="blue" />
      <StatCard
        titulo="Matrículas pendientes"
        valor={matriculas.filter((m) => m.estado_verificacion === "pendiente").length}
        color="gray"
      />
      <StatCard titulo="Categorías" valor={totalCategorias} color="green" />
    </section>
  );
}
