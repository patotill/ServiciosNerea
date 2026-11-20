import DashboardLayout from "../../components/dashboard/dashboardLayout";
import ListaReservas from "../../components/dashboard/listaReservas";
import ResumenReservas from "../../components/dashboard/resumenReservas";
import useReservas from "../../hooks/reservas/useReservas";
import useUsuario from "../../hooks/sesion/useUsuario";
import { Neutros } from "../../utils/colors";

const NO_INFORMADO = "No informado";

export default function ClienteDashboard() {
  const { reservas, cargando, error, recargar } = useReservas();
  const usuario = useUsuario();

  return (
    <DashboardLayout color="blue" titulo="Panel de cliente">
      <section
        aria-labelledby="datos-cliente-titulo"
        className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h2
          id="datos-cliente-titulo"
          className={`text-lg font-semibold ${Neutros.titulo}`}
        >
          Tus datos
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ["Nombre", usuario.nombre ?? NO_INFORMADO],
            ["Email", usuario.email],
            ["Teléfono", usuario.telefono ?? NO_INFORMADO],
            ["Código postal", usuario.codigo_postal ?? NO_INFORMADO],
          ].map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt className={`text-sm font-medium ${Neutros.textoSuave}`}>
                {etiqueta}
              </dt>
              <dd className={`mt-1 break-all ${Neutros.titulo}`}>{valor}</dd>
            </div>
          ))}
        </dl>
      </section>
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
