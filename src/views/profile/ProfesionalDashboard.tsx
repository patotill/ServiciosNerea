import DashboardLayout from "../../components/dashboard/dashboardLayout";
import ListaReservas from "../../components/dashboard/listaReservas";
import ResumenReservas from "../../components/dashboard/resumenReservas";
import useMatricula from "../../hooks/reservas/useMatricula";
import useReservas from "../../hooks/reservas/useReservas";
import AppColors from "../../utils/colors";

export default function ProfesionalDashboard() {
  const { reservas, cargando, error, recargar } = useReservas();
  const { estado: matricula, cargando: cargandoMatricula } = useMatricula();

  return (
    <DashboardLayout color="green" titulo="Panel del profesional">
      {!cargandoMatricula && matricula !== "verificada" && (
        <p
          role="status"
          className={`mt-4 rounded-lg border p-3 text-sm ${AppColors.red.border} ${AppColors.red.text}`}
        >
          {matricula === null
            ? "No cargaste tu matrícula: los clientes verán este aviso antes de reservar."
            : `Tu matrícula está ${matricula}: los clientes verán este aviso antes de reservar.`}
        </p>
      )}
      {!cargando && !error && <ResumenReservas reservas={reservas} />}
      <ListaReservas
        titulo="Mis reservas"
        reservas={reservas}
        cargando={cargando}
        error={error}
        recargar={recargar}
      />
    </DashboardLayout>
  );
}
