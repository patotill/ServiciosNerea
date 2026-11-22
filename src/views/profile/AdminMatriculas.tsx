import MatriculasAdmin from "../../components/admin/matriculasAdmin";
import SeccionAdmin from "../../components/admin/seccionAdmin";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAdminMatriculas from "../../hooks/admin/useAdminMatriculas";

export default function AdminMatriculas() {
  const matriculas = useAdminMatriculas();

  return (
    <DashboardLayout color="gray" titulo="Panel del administrador">
      <SeccionAdmin
        titulo="Verificación de Matrículas"
        cargando={matriculas.cargando}
        error={matriculas.error}
      >
        <MatriculasAdmin
          matriculas={matriculas.matriculas}
          ocupado={matriculas.ocupado}
          onVerificar={matriculas.verificar}
          onRechazar={matriculas.rechazar}
        />
      </SeccionAdmin>
    </DashboardLayout>
  );
}
