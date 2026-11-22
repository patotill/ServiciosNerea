import ReservasAdmin from "../../components/admin/reservasAdmin";
import SeccionAdmin from "../../components/admin/seccionAdmin";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAdminReservas from "../../hooks/admin/useAdminReservas";

export default function AdminReservas() {
  const reservas = useAdminReservas();

  return (
    <DashboardLayout color="gray" titulo="Panel del administrador">
      <SeccionAdmin
        titulo="Gestión de reservas"
        cargando={reservas.cargando}
        error={reservas.error}
      >
        <ReservasAdmin
          reservas={reservas.reservas}
          ocupado={reservas.ocupado}
          onGestionar={reservas.gestionar}
          onEliminar={reservas.eliminar}
        />
      </SeccionAdmin>
    </DashboardLayout>
  );
}
