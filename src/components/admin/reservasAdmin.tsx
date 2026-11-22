import { useState, type FormEvent } from "react";
import type { Disponibilidad } from "../../types/agenda";
import type {
  GestionReservaAdmin,
  ReservaAdmin as ReservaAdminType,
} from "../../types/admin";
import AppColors, { Neutros } from "../../utils/colors";
import { obtenerTurnosDisponibles } from "../../services/agendaService";
import { formatearFranja } from "../../utils/fechas";
import EstadoBadge from "../dashboard/estadoBadge";

type ReservasAdminProps = {
  reservas: ReservaAdminType[];
  ocupado: boolean;
  onGestionar: (datos: GestionReservaAdmin) => Promise<boolean>;
  onEliminar: (idReserva: number) => Promise<boolean>;
};

type AccionConfirmacion = {
  idReserva: number;
  accion: "rechazar" | "eliminar";
};

function mostrarFranja(
  turno: ReservaAdminType["disponibilidad"],
): string {
  return turno
    ? formatearFranja(turno.fecha, turno.hora_inicio, turno.hora_fin)
    : "Sin franja asignada";
}

export default function ReservasAdmin({
  reservas,
  ocupado,
  onGestionar,
  onEliminar,
}: ReservasAdminProps) {
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [idDisponibilidad, setIdDisponibilidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<AccionConfirmacion | null>(
    null,
  );

  const iniciarEdicion = async (reserva: ReservaAdminType) => {
    setCargandoTurnos(true);
    setErrorLocal(null);
    setConfirmacion(null);
    try {
      const disponibles = await obtenerTurnosDisponibles(
        reserva.id_profesional,
      );
      setTurnos(
        disponibles.filter(
          (turno) => turno.id_disponibilidad !== reserva.id_disponibilidad,
        ),
      );
      setIdDisponibilidad(String(reserva.id_disponibilidad));
      setDescripcion(reserva.descripcion_trabajo ?? "");
      setIdEditando(reserva.id_reserva);
    } catch (error: unknown) {
      setErrorLocal(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los turnos disponibles.",
      );
    } finally {
      setCargandoTurnos(false);
    }
  };

  const guardarCambios = async (
    evento: FormEvent<HTMLFormElement>,
    reserva: ReservaAdminType,
  ) => {
    evento.preventDefault();
    if (!idDisponibilidad) return;

    const guardado = await onGestionar({
      accion: "modificar",
      id_reserva: reserva.id_reserva,
      id_disponibilidad: Number(idDisponibilidad),
      descripcion_trabajo: descripcion,
    });
    if (guardado) setIdEditando(null);
  };

  const ejecutarConfirmacion = async (reserva: ReservaAdminType) => {
    if (!confirmacion || confirmacion.idReserva !== reserva.id_reserva) return;

    const completado =
      confirmacion.accion === "eliminar"
        ? await onEliminar(reserva.id_reserva)
        : await onGestionar({
            accion: "rechazar",
            id_reserva: reserva.id_reserva,
          });
    if (completado) setConfirmacion(null);
  };

  if (reservas.length === 0) {
    return (
      <p role="status" className={Neutros.textoSuave}>
        No hay reservas registradas.
      </p>
    );
  }

  return (
    <>
      {errorLocal && (
        <p role="alert" className={`mb-4 text-sm ${AppColors.red.text}`}>
          {errorLocal}
        </p>
      )}
      <ul className="space-y-4">
        {reservas.map((reserva) => {
          const editando = idEditando === reserva.id_reserva;
          const confirmando =
            confirmacion?.idReserva === reserva.id_reserva;

          return (
            <li key={reserva.id_reserva}>
              <article
                className={`flex flex-col gap-4 rounded-xl border bg-gray-100 p-4 ${Neutros.bordeTarjeta} md:flex-row md:justify-between`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className={`font-semibold ${Neutros.titulo}`}>
                        {reserva.servicio_categoria?.nombre ?? "Servicio"} ·{" "}
                        <span className="font-normal capitalize">
                          {reserva.tipo_reserva}
                        </span>
                      </h4>
                      <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
                        Reserva #{reserva.id_reserva}
                      </p>
                    </div>
                    <EstadoBadge estado={reserva.estado} />
                  </div>

                  <p className={`mt-2 text-sm ${Neutros.texto}`}>
                    {reserva.descripcion_trabajo ?? "Sin descripción"}
                  </p>
                  <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
                    {mostrarFranja(reserva.disponibilidad)}
                  </p>
                  <div className={`mt-2 space-y-1 text-sm ${Neutros.textoSuave}`}>
                    <p>
                      <span className="font-medium">Cliente:</span>{" "}
                      {reserva.cliente?.nombre ??
                        `Cliente #${reserva.id_cliente}`}
                      {reserva.cliente?.email && (
                        <>
                          {" · "}
                          {reserva.cliente.email}
                        </>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Profesional:</span>{" "}
                      {reserva.profesional?.nombre ??
                        `Profesional #${reserva.id_profesional}`}
                    </p>
                  </div>

                  {editando && (
                    <form
                      onSubmit={(evento) =>
                        void guardarCambios(evento, reserva)
                      }
                      className="mt-4 space-y-3"
                    >
                      <div>
                        <label
                          htmlFor={`reserva-turno-admin-${reserva.id_reserva}`}
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Turno
                        </label>
                        <select
                          id={`reserva-turno-admin-${reserva.id_reserva}`}
                          value={idDisponibilidad}
                          onChange={(evento) =>
                            setIdDisponibilidad(evento.target.value)
                          }
                          required
                          className={`min-h-11 w-full rounded-lg border ${Neutros.borde} bg-white px-3 py-2 focus:ring-2 ${AppColors.blue.focusRing}`}
                        >
                          <option value={String(reserva.id_disponibilidad)}>
                            Mantener: {mostrarFranja(reserva.disponibilidad)}
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
                            No hay otros turnos disponibles; podés mantener el
                            actual y cambiar la descripción.
                          </p>
                        )}
                        {(reserva.estado === "cancelada" ||
                          reserva.estado === "rechazada") && (
                          <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
                            La reserva seguirá {reserva.estado}; el turno no se
                            volverá a ocupar.
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor={`reserva-descripcion-admin-${reserva.id_reserva}`}
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Descripción del trabajo
                        </label>
                        <textarea
                          id={`reserva-descripcion-admin-${reserva.id_reserva}`}
                          value={descripcion}
                          onChange={(evento) =>
                            setDescripcion(evento.target.value)
                          }
                          maxLength={1000}
                          rows={3}
                          className={`w-full rounded-lg border ${Neutros.borde} bg-white px-3 py-2 focus:ring-2 ${AppColors.blue.focusRing}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={ocupado}
                          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.blue.bg} ${AppColors.blue.hover} ${Neutros.foco}`}
                        >
                          {ocupado ? "Guardando…" : "Guardar cambios"}
                        </button>
                        <button
                          type="button"
                          disabled={ocupado}
                          onClick={() => setIdEditando(null)}
                          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium ${Neutros.hoverSuave} ${Neutros.foco}`}
                        >
                          Cancelar edición
                        </button>
                      </div>
                    </form>
                  )}

                  {confirmando && (
                    <div className="mt-4 space-y-2">
                      <p className={`text-sm ${Neutros.texto}`}>
                        {confirmacion.accion === "eliminar"
                          ? "Esta acción eliminará definitivamente la reserva."
                          : "¿Rechazar la solicitud? El turno se liberará."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={ocupado}
                          onClick={() => void ejecutarConfirmacion(reserva)}
                          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.red.bg} ${AppColors.red.hover} ${Neutros.foco}`}
                        >
                          {ocupado
                            ? "Procesando…"
                            : confirmacion.accion === "eliminar"
                              ? "Eliminar definitivamente"
                              : "Confirmar rechazo"}
                        </button>
                        <button
                          type="button"
                          disabled={ocupado}
                          onClick={() => setConfirmacion(null)}
                          className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium ${Neutros.hoverSuave} ${Neutros.foco}`}
                        >
                          Volver
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex w-full shrink-0 flex-col gap-2 md:w-48">
                  {reserva.estado === "pendiente" && !confirmando && !editando && (
                    <>
                      <button
                        type="button"
                        disabled={ocupado}
                        aria-label={`Aceptar la reserva ${reserva.id_reserva}`}
                        onClick={() =>
                          void onGestionar({
                            accion: "aceptar",
                            id_reserva: reserva.id_reserva,
                          })
                        }
                        className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${AppColors.green.bg} ${AppColors.green.hover} ${Neutros.foco}`}
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        disabled={ocupado}
                        aria-label={`Rechazar la reserva ${reserva.id_reserva}`}
                        onClick={() =>
                          setConfirmacion({
                            idReserva: reserva.id_reserva,
                            accion: "rechazar",
                          })
                        }
                        className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium ${AppColors.red.border} ${AppColors.red.text} ${Neutros.foco}`}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {!confirmando && !editando && (
                    <button
                      type="button"
                      disabled={ocupado || cargandoTurnos}
                      aria-label={`Modificar la reserva ${reserva.id_reserva}`}
                      onClick={() => void iniciarEdicion(reserva)}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${AppColors.blue.border} ${AppColors.blue.text} ${Neutros.foco}`}
                    >
                      {cargandoTurnos
                        ? "Cargando turnos…"
                        : "Modificar"}
                    </button>
                  )}
                  {!confirmando && !editando && (
                    <button
                      type="button"
                      disabled={ocupado}
                      aria-label={`Eliminar la reserva ${reserva.id_reserva}`}
                      onClick={() =>
                        setConfirmacion({
                          idReserva: reserva.id_reserva,
                          accion: "eliminar",
                        })
                      }
                      className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${AppColors.red.border} ${AppColors.red.text} ${Neutros.foco}`}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
