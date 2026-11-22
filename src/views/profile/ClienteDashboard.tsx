import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import ListaReservas from "../../components/dashboard/listaReservas";
import ResumenReservas from "../../components/dashboard/resumenReservas";
import useReservas from "../../hooks/reservas/useReservas";
import useUsuario from "../../hooks/sesion/useUsuario";
import { ROUTES } from "../../router/routes";
import AppColors, { Neutros } from "../../utils/colors";

const NO_INFORMADO = "No informado";

export default function ClienteDashboard() {
  const { reservas, cargando, error, recargar } = useReservas();
  const usuario = useUsuario();

  return (
    <DashboardLayout color="blue" titulo="Panel de cliente">
      <section
        aria-labelledby="datos-cliente-titulo"
        className={`mt-6 rounded-xl border ${Neutros.bordeTarjeta} bg-gray-200 p-5 shadow-sm sm:p-6`}
      >
        <h2
          id="datos-cliente-titulo"
          className={`text-lg font-semibold ${Neutros.titulo}`}
        >
          Tus datos
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className={`text-sm font-medium ${Neutros.textoSuave}`}>
              Nombre
            </dt>
            <dd className={`mt-1 break-all ${Neutros.titulo}`}>
              {usuario.nombre ?? NO_INFORMADO}
            </dd>
          </div>
          <div>
            <dt className={`text-sm font-medium ${Neutros.textoSuave}`}>
              Email
            </dt>
            <dd className={`mt-1 break-all ${Neutros.titulo}`}>
              {usuario.email || NO_INFORMADO}
            </dd>
          </div>
        </dl>
      </section>
      <section className={`mt-6 flex flex-col gap-4 rounded-xl border ${Neutros.bordeTarjeta} bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
        <div>
          <h2 className={`text-lg font-semibold ${Neutros.titulo}`}>
            ¿Querés agendar un turno?
          </h2>
          <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
            Buscá un profesional, elegí un horario disponible y enviá tu solicitud.
          </p>
        </div>
        <Link
          to={ROUTES.PUBLICO}
          className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-semibold text-white ${AppColors.blue.bg} ${AppColors.blue.hover} ${Neutros.foco}`}
        >
          Buscar profesionales
        </Link>
      </section>
      {!cargando && !error && <ResumenReservas reservas={reservas} />}
      <ListaReservas
        titulo="Mis reservas"
        reservas={reservas}
        cargando={cargando}
        error={error}
        recargar={recargar}
        onCambioReserva={recargar}
      />
    </DashboardLayout>
  );
}
