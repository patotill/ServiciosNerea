import { useState, type FormEvent } from "react";
import { obtenerTurnosDisponibles } from "../../services/agendaService";
import {
  cancelarReserva,
  modificarReserva,
} from "../../services/reservaService";
import type { Disponibilidad } from "../../types/agenda";
import type {
  AccionRespuestaReserva,
  Reserva,
} from "../../types/reserva";
import AppColors, { Neutros } from "../../utils/colors";
import { esFechaHoraFutura, formatearFranja } from "../../utils/fechas";
import EstadoBadge from "./estadoBadge";

type ReservaCardProps = {
  reserva: Reserva;
  onCambioReserva?: () => Promise<void>;
  onGestionProfesionalReserva?: (
    idReserva: number,
    accion: AccionRespuestaReserva,
  ) => Promise<void>;
};

export default function ReservaCard({
  reserva,
  onCambioReserva,
  onGestionProfesionalReserva,
}: ReservaCardProps) {
  const { disponibilidad } = reserva;
  const [editando, setEditando] = useState(false);
  const [confirmandoBaja, setConfirmandoBaja] = useState(false);
  const [confirmandoRechazo, setConfirmandoRechazo] = useState(false);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);
  const [idDisponibilidad, setIdDisponibilidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const puedeGestionar = Boolean(
    onCambioReserva &&
      reserva.estado === "pendiente" &&
      disponibilidad &&
      esFechaHoraFutura(disponibilidad.fecha, disponibilidad.hora_inicio),
  );
  const puedeResponderProfesional = Boolean(
    onGestionProfesionalReserva && reserva.estado === "pendiente",
  );

  const iniciarEdicion = async () => {
    setCargandoTurnos(true);
    setErrorAccion(null);
    try {
      const disponibles = await obtenerTurnosDisponibles(
        reserva.id_profesional,
      );
      setTurnos(
        disponibles.filter(
          (turno) =>
            turno.id_disponibilidad !== reserva.id_disponibilidad &&
            esFechaHoraFutura(turno.fecha, turno.hora_inicio),
        ),
      );
      setIdDisponibilidad(String(reserva.id_disponibilidad));
      setDescripcion(reserva.descripcion_trabajo ?? "");
      setEditando(true);
    } catch (error: unknown) {
      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar otros turnos.",
      );
    } finally {
      setCargandoTurnos(false);
    }
  };

  const guardarCambios = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!onCambioReserva || !idDisponibilidad) return;

    setGuardando(true);
    setErrorAccion(null);
    try {
      await modificarReserva(
        reserva.id_reserva,
        Number(idDisponibilidad),
        descripcion,
      );
      setEditando(false);
      await onCambioReserva();
    } catch (error: unknown) {
      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudo modificar la reserva.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const darDeBaja = async () => {
    if (!onCambioReserva) return;

    setGuardando(true);
    setErrorAccion(null);
    try {
      await cancelarReserva(reserva.id_reserva);
      setConfirmandoBaja(false);
      await onCambioReserva();
    } catch (error: unknown) {
      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudo dar de baja la reserva.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const responderReserva = async (accion: AccionRespuestaReserva) => {
    if (!onGestionProfesionalReserva) return;

    setGuardando(true);
    setErrorAccion(null);
    try {
      await onGestionProfesionalReserva(reserva.id_reserva, accion);
      setConfirmandoRechazo(false);
    } catch (error: unknown) {
      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudo responder la reserva.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <article className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-slate-800">
          {reserva.servicio_categoria?.nombre ?? "Servicio"} ·{" "}
          <span className="font-normal capitalize">{reserva.tipo_reserva}</span>
        </h4>
        <p className="mt-1 text-sm text-slate-600">
          {reserva.descripcion_trabajo ?? "Sin descripción"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {disponibilidad
            ? formatearFranja(
                disponibilidad.fecha,
                disponibilidad.hora_inicio,
                disponibilidad.hora_fin,
              )
            : "Sin franja asignada"}
        </p>
        {reserva.cliente && (
          <div className="mt-2 space-y-0.5 text-sm text-slate-600">
            <p>
              <span className="font-medium">Cliente:</span>{" "}
              {reserva.cliente.nombre || "Sin nombre"}
            </p>
            <p>
              <span className="font-medium">Correo:</span>{" "}
              {reserva.cliente.email ? (
                <a
                  href={`mailto:${reserva.cliente.email}`}
                  className={`break-all ${AppColors.blue.linkHover}`}
                >
                  {reserva.cliente.email}
                </a>
              ) : (
                "No informado"
              )}
            </p>
            <p>
              <span className="font-medium">Teléfono:</span>{" "}
              {reserva.cliente.telefono ? (
                <a
                  href={`tel:${reserva.cliente.telefono}`}
                  className={`break-all ${AppColors.blue.linkHover}`}
                >
                  {reserva.cliente.telefono}
                </a>
              ) : (
                "No informado"
              )}
            </p>
          </div>
        )}

        {puedeGestionar && !editando && !confirmandoBaja && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void iniciarEdicion()}
              disabled={cargandoTurnos || guardando}
              className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${AppColors.blue.border} ${AppColors.blue.text} ${Neutros.foco}`}
            >
              {cargandoTurnos ? "Cargando turnos…" : "Modificar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorAccion(null);
                setConfirmandoBaja(true);
              }}
              disabled={cargandoTurnos || guardando}
              className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${AppColors.red.border} ${AppColors.red.text} ${Neutros.foco}`}
            >
              Dar de baja
            </button>
          </div>
        )}

        {puedeResponderProfesional &&
          !confirmandoRechazo &&
          !editando &&
          !confirmandoBaja && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void responderReserva("aceptar")}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.green.bg} ${AppColors.green.hover} ${Neutros.foco}`}
              >
                {guardando ? "Procesando…" : "Aceptar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorAccion(null);
                  setConfirmandoRechazo(true);
                }}
                disabled={guardando}
                className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${AppColors.red.border} ${AppColors.red.text} ${Neutros.foco}`}
              >
                Rechazar
              </button>
            </div>
          )}

        {confirmandoRechazo && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-slate-700">
              ¿Rechazar esta reserva? El turno se liberará para otros clientes.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void responderReserva("rechazar")}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.red.bg} ${AppColors.red.hover} ${Neutros.foco}`}
              >
                {guardando ? "Procesando…" : "Confirmar rechazo"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmandoRechazo(false);
                  setErrorAccion(null);
                }}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${Neutros.hoverSuave} ${Neutros.foco}`}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {editando && disponibilidad && (
          <form onSubmit={guardarCambios} className="mt-4 space-y-3">
            <div>
              <label
                htmlFor={`reserva-turno-${reserva.id_reserva}`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Turno
              </label>
              <select
                id={`reserva-turno-${reserva.id_reserva}`}
                value={idDisponibilidad}
                onChange={(evento) => setIdDisponibilidad(evento.target.value)}
                required
                className={`min-h-11 w-full rounded-lg border ${Neutros.borde} bg-white px-3 py-2 focus:ring-2 ${AppColors.blue.focusRing}`}
              >
                <option value={String(reserva.id_disponibilidad)}>
                  Mantener:{" "}
                  {formatearFranja(
                    disponibilidad.fecha,
                    disponibilidad.hora_inicio,
                    disponibilidad.hora_fin,
                  )}
                </option>
                {turnos.map((turno) => (
                  <option
                    key={turno.id_disponibilidad}
                    value={String(turno.id_disponibilidad)}
                  >
                    {formatearFranja(
                      turno.fecha,
                      turno.hora_inicio,
                      turno.hora_fin,
                    )}
                  </option>
                ))}
              </select>
              {turnos.length === 0 && (
                <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
                  No hay otros turnos disponibles; podés mantener este horario y
                  cambiar la descripción.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`reserva-descripcion-${reserva.id_reserva}`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descripción del trabajo
              </label>
              <textarea
                id={`reserva-descripcion-${reserva.id_reserva}`}
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                maxLength={1000}
                rows={3}
                className={`w-full rounded-lg border ${Neutros.borde} px-3 py-2 focus:ring-2 ${AppColors.blue.focusRing}`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.blue.bg} ${AppColors.blue.hover} ${Neutros.foco}`}
              >
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  setErrorAccion(null);
                }}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${Neutros.hoverSuave} ${Neutros.foco}`}
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {confirmandoBaja && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-slate-700">
              ¿Querés dar de baja esta reserva? El turno se liberará para otros
              clientes.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void darDeBaja()}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.red.bg} ${AppColors.red.hover} ${Neutros.foco}`}
              >
                {guardando ? "Procesando…" : "Confirmar baja"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoBaja(false)}
                disabled={guardando}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${Neutros.hoverSuave} ${Neutros.foco}`}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {errorAccion && (
          <p role="alert" className={`mt-3 text-sm ${AppColors.red.text}`}>
            {errorAccion}
          </p>
        )}
      </div>
      <EstadoBadge estado={reserva.estado} />
    </article>
  );
}
