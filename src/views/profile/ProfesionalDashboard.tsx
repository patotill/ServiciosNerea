import DashboardLayout from "../../components/dashboard/dashboardLayout";
import ListaReservas from "../../components/dashboard/listaReservas";
import ResumenReservas from "../../components/dashboard/resumenReservas";
import useMatricula from "../../hooks/reservas/useMatricula";
import useReservas from "../../hooks/reservas/useReservas";
import useUsuario from "../../hooks/sesion/useUsuario";
import { responderReserva } from "../../services/reservaService";
import type { AccionRespuestaReserva } from "../../types/reserva";
import AppColors, { Neutros } from "../../utils/colors";

const NO_INFORMADO = "No informado";

export default function ProfesionalDashboard() {
  const { reservas, cargando, error, recargar } = useReservas();
  const usuario = useUsuario();
  const gestionarReserva = async (
    idReserva: number,
    accion: AccionRespuestaReserva,
  ) => {
    await responderReserva(idReserva, accion);
    await recargar();
  };
  const {
    estado: matricula,
    cargando: cargandoMatricula,
    error: errorMatricula,
    recargar: recargarMatricula,
  } = useMatricula();

  return (
    <DashboardLayout color="green" titulo="Panel del profesional">
      <section
        aria-labelledby="datos-profesional-titulo"
        className={`mt-6 rounded-xl border ${Neutros.bordeTarjeta} bg-gray-200 p-5 shadow-sm sm:p-6`}
      >
        <h2
          id="datos-profesional-titulo"
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
      {errorMatricula ? (
        <div
          role="alert"
          className={`mt-4 rounded-lg border p-3 text-sm ${AppColors.red.border} ${AppColors.red.text}`}
        >
          <p>No pudimos verificar tu matrícula.</p>
          <button
            type="button"
            onClick={recargarMatricula}
            className={`mt-2 min-h-11 underline ${AppColors.green.text} ${Neutros.foco}`}
          >
            Reintentar
          </button>
        </div>
      ) : !cargandoMatricula && matricula !== "verificada" ? (
        <p
          role="status"
          className={`mt-4 rounded-lg border p-3 text-sm ${AppColors.red.border} ${AppColors.red.text}`}
        >
          {matricula === null
            ? "No cargaste tu matrícula: los clientes verán este aviso antes de reservar."
            : `Tu matrícula está ${matricula}: los clientes verán este aviso antes de reservar.`}
        </p>
      ) : null}
      {!cargando && !error && <ResumenReservas reservas={reservas} />}
      <ListaReservas
        titulo="Mis reservas"
        reservas={reservas}
        cargando={cargando}
        error={error}
        recargar={recargar}
        onGestionProfesionalReserva={gestionarReserva}
      />
    </DashboardLayout>
  );
}
