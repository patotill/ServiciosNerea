import CategoriasAdmin from "../../components/admin/categoriasAdmin";
import SeccionAdmin from "../../components/admin/seccionAdmin";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAdminCategorias from "../../hooks/admin/useAdminCategorias";

export default function AdminCategorias() {
  const categorias = useAdminCategorias();

  return (
    <DashboardLayout color="gray" titulo="Panel del administrador">
      <SeccionAdmin
        titulo="Categorías de servicio"
        cargando={categorias.cargando}
        error={categorias.error}
      >
        <CategoriasAdmin
          categorias={categorias.categorias}
          ocupado={categorias.ocupado}
          error={categorias.error}
          onGuardar={categorias.guardar}
          onBorrar={categorias.borrar}
        />
      </SeccionAdmin>
    </DashboardLayout>
  );
}
