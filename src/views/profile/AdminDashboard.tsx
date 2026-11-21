import ResumenAdmin from "../../components/admin/resumenAdmin";
import SeccionAdmin from "../../components/admin/seccionAdmin";
import UsuariosAdmin from "../../components/admin/usuariosAdmin";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAdminCategorias from "../../hooks/admin/useAdminCategorias";
import useAdminMatriculas from "../../hooks/admin/useAdminMatriculas";
import useAdminTotalReservas from "../../hooks/admin/useAdminTotalReservas";
import useAdminUsuarios from "../../hooks/admin/useAdminUsuarios";
import useUsuario from "../../hooks/sesion/useUsuario";
import AppColors from "../../utils/colors";

export default function AdminDashboard() {
  const { id_usuario } = useUsuario();
  const usuarios = useAdminUsuarios();
  const categorias = useAdminCategorias();
  const matriculas = useAdminMatriculas();
  const totalReservas = useAdminTotalReservas();

  return (
    <DashboardLayout color="gray" titulo="Panel del administrador">
      <ResumenAdmin
        usuarios={usuarios.usuarios}
        matriculas={matriculas.matriculas}
        totalCategorias={categorias.categorias.length}
        totalReservas={totalReservas.total}
      />
      {totalReservas.error && (
        <p role="alert" className={`mt-2 text-sm ${AppColors.red.text}`}>
          {totalReservas.error}
        </p>
      )}

      <SeccionAdmin
        titulo="Listado de Usuarios"
        cargando={usuarios.cargando}
        error={usuarios.error}
      >
        <UsuariosAdmin
          usuarios={usuarios.usuarios}
          idPropio={id_usuario}
          ocupado={usuarios.ocupado}
          onCambiarActivo={usuarios.cambiarActivo}
        />
      </SeccionAdmin>
    </DashboardLayout>
  );
}
