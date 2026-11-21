import MatriculasAdmin from "../../components/admin/matriculasAdmin";
import ResumenAdmin from "../../components/admin/resumenAdmin";
import SeccionAdmin from "../../components/admin/seccionAdmin";
import UsuariosAdmin from "../../components/admin/usuariosAdmin";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAdminCategorias from "../../hooks/admin/useAdminCategorias";
import useAdminMatriculas from "../../hooks/admin/useAdminMatriculas";
import useAdminUsuarios from "../../hooks/admin/useAdminUsuarios";
import useUsuario from "../../hooks/sesion/useUsuario";

export default function AdminDashboard() {
  const { id_usuario } = useUsuario();
  const usuarios = useAdminUsuarios();
  const categorias = useAdminCategorias();
  const matriculas = useAdminMatriculas();

  return (
    <DashboardLayout color="gray" titulo="Panel del administrador">
      <ResumenAdmin
        usuarios={usuarios.usuarios}
        matriculas={matriculas.matriculas}
        totalCategorias={categorias.categorias.length}
      />

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
