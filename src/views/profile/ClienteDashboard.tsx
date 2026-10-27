import DashboardLayout from "../../components/dashboard/dashboardLayout";
import ListaReservas from "../../components/dashboard/listaReservas";
import ResumenReservas from "../../components/dashboard/resumenReservas";
import useReservas from "../../hooks/reservas/useReservas";

export default function ClienteDashboard() {
  const { reservas, esMock, cargando } = useReservas();

  return (
    <DashboardLayout rol="cliente" color="blue" titulo="Panel de cliente">
      <ResumenReservas reservas={reservas} />
      <ListaReservas
        titulo="Mis reservas"
        reservas={reservas}
        cargando={cargando}
        esMock={esMock}
      />
    </DashboardLayout>
  );
}
