import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useReservaTurno from "../../hooks/agenda/useReservaTurno";
import { ROUTES } from "../../router/routes";
import AppColors, { Neutros } from "../../utils/colors";
import { formatearFranja } from "../../utils/fechas";

export default function ReservarTurno() {
  const { id_profesional: idParametro } = useParams();
  const idConvertido = Number(idParametro);
  const idProfesional =
    Number.isInteger(idConvertido) && idConvertido > 0 ? idConvertido : null;
  const {
    profesional,
    turnos,
    cargando,
    guardando,
    error,
    mensaje,
    recargar,
    reservar,
  } = useReservaTurno(idProfesional);
  const [idServicio, setIdServicio] = useState("");
  const [idTurno, setIdTurno] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const servicios =
    profesional?.ids_servicio.map((id, indice) => ({
      id,
      nombre: profesional.servicios[indice] ?? "Servicio",
    })) ?? [];
  const idServicioInicial = servicios[0] ? String(servicios[0].id) : "";
  const idServicioElegido = idServicio || idServicioInicial;

  const enviarSolicitud = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!idServicioElegido || !idTurno) return;
    const creada = await reservar(
      Number(idServicioElegido),
      Number(idTurno),
      descripcion,
    );
    if (creada) {
      setIdTurno("");
      setDescripcion("");
    }
  };

  return (
    <DashboardLayout color="blue" titulo="Reservar un turno">
      <div className="mt-6">
        <Link
          to={ROUTES.PUBLICO}
          className={`inline-flex min-h-11 items-center ${AppColors.blue.text} underline ${Neutros.foco}`}
        >
          Volver a profesionales
        </Link>
      </div>

      {idProfesional === null ? (
        <p role="alert" className={`mt-4 ${AppColors.red.text}`}>
          El profesional indicado no es válido.
        </p>
      ) : cargando ? (
        <p role="status" className={`mt-4 ${Neutros.textoSuave}`}>
          Cargando turnos…
        </p>
      ) : error ? (
        <div role="alert" className="mt-4">
          <p className={AppColors.red.text}>{error}</p>
          <button
            type="button"
            onClick={recargar}
            className={`mt-3 min-h-11 rounded-lg px-4 py-2 font-medium text-white ${Neutros.foco} ${AppColors.blue.bg} ${AppColors.blue.hover}`}
          >
            Reintentar
          </button>
        </div>
      ) : !profesional ? (
        <p role="status" className={`mt-4 ${Neutros.textoSuave}`}>
          No encontramos ese profesional.
        </p>
      ) : servicios.length === 0 ? (
        <p role="status" className={`mt-4 ${Neutros.textoSuave}`}>
          Este profesional todavía no tiene servicios para reservar.
        </p>
      ) : turnos.length === 0 ? (
        <p role="status" className={`mt-4 ${Neutros.textoSuave}`}>
          {profesional.nombre} todavía no publicó turnos disponibles.
        </p>
      ) : (
        <section className={`mt-4 rounded-xl border ${Neutros.bordeTarjeta} bg-white p-5 shadow-sm sm:p-6`}>
          <h2 className={`text-xl font-semibold ${Neutros.titulo}`}>
            Turnos de {profesional.nombre}
          </h2>
          <form onSubmit={enviarSolicitud} className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="servicio-reserva"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Servicio
              </label>
              <select
                id="servicio-reserva"
                value={idServicioElegido}
                onChange={(evento) => setIdServicio(evento.target.value)}
                required
                className={`min-h-11 w-full rounded-lg border ${Neutros.borde} bg-white px-4 py-2 focus:ring-2 ${AppColors.blue.focusRing}`}
              >
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="descripcion-reserva"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descripción del trabajo (opcional)
              </label>
              <textarea
                id="descripcion-reserva"
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Contale al profesional qué necesitás resolver."
                className={`w-full rounded-lg border ${Neutros.borde} px-4 py-3 focus:ring-2 ${AppColors.blue.focusRing}`}
              />
            </div>

            <fieldset>
              <legend className={`mb-2 font-medium ${Neutros.titulo}`}>
                Elegí un turno
              </legend>
              <ul className="grid gap-3 sm:grid-cols-2">
                {turnos.map((turno) => (
                  <li key={turno.id_disponibilidad}>
                    <label
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 ${idTurno === String(turno.id_disponibilidad) ? `${AppColors.blue.border} ${AppColors.blue.bgLight}` : Neutros.bordeTarjeta} ${Neutros.foco}`}
                    >
                      <input
                        type="radio"
                        name="turno"
                        value={turno.id_disponibilidad}
                        checked={idTurno === String(turno.id_disponibilidad)}
                        onChange={(evento) => setIdTurno(evento.target.value)}
                        required
                        className={AppColors.blue.text}
                      />
                      <span className={Neutros.titulo}>
                        {formatearFranja(
                          turno.fecha,
                          turno.hora_inicio,
                          turno.hora_fin,
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>

            {error && (
              <p role="alert" className={AppColors.red.text}>
                {error}
              </p>
            )}
            {mensaje && (
              <p role="status" className={AppColors.green.text}>
                {mensaje}
              </p>
            )}
            <button
              type="submit"
              disabled={guardando || !idServicioElegido || !idTurno}
              className={`min-h-11 w-full rounded-lg px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${Neutros.foco} ${AppColors.blue.bg} ${AppColors.blue.hover}`}
            >
              {guardando ? "Enviando solicitud…" : "Solicitar turno"}
            </button>
          </form>
        </section>
      )}
    </DashboardLayout>
  );
}
