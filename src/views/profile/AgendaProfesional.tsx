import { useState, type FormEvent } from "react";
import { FormInput } from "../../components/inputs/formInput";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import useAgendaProfesional from "../../hooks/agenda/useAgendaProfesional";
import type { DuracionTurno } from "../../types/agenda";
import { formatearFranja, obtenerFechaLocal } from "../../utils/fechas";
import AppColors, { Neutros } from "../../utils/colors";

const DURACIONES: { valor: DuracionTurno; etiqueta: string }[] = [
  { valor: 60, etiqueta: "1 hora" },
  { valor: 120, etiqueta: "2 horas" },
  { valor: 180, etiqueta: "3 horas" },
];

function esDuracionTurno(valor: number): valor is DuracionTurno {
  return DURACIONES.some((duracion) => duracion.valor === valor);
}

export default function AgendaProfesional() {
  const {
    turnos,
    cargando,
    guardando,
    error,
    mensaje,
    recargar,
    agregarTurnos,
    quitarTurno,
  } = useAgendaProfesional();
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [duracion, setDuracion] = useState<DuracionTurno>(60);

  const agregar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const agregado = await agregarTurnos({
      fecha,
      horaInicio,
      horaFin,
      duracion,
    });
    if (agregado) {
      setHoraInicio("");
      setHoraFin("");
    }
  };

  return (
    <DashboardLayout color="green" titulo="Mi agenda">
      <section
        aria-labelledby="nueva-disponibilidad"
        className={`mt-6 rounded-xl border ${Neutros.bordeTarjeta} bg-white p-5 shadow-sm sm:p-6`}
      >
        <h2
          id="nueva-disponibilidad"
          className={`text-lg font-semibold ${Neutros.titulo}`}
        >
          Agregar horarios disponibles
        </h2>
        <p className={`mt-1 text-sm ${Neutros.textoSuave}`}>
          Elegí una fecha y un rango. Se va a dividir en turnos consecutivos de
          la duración seleccionada.
        </p>
        <form onSubmit={agregar} className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormInput
            id="agenda-fecha"
            title="Día"
            type="date"
            min={obtenerFechaLocal()}
            required
            value={fecha}
            onChange={setFecha}
          />
          <div>
            <label
              htmlFor="agenda-duracion"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Duración de cada turno
            </label>
            <select
              id="agenda-duracion"
              value={duracion}
              onChange={(evento) => {
                const valor = Number(evento.target.value);
                if (esDuracionTurno(valor)) setDuracion(valor);
              }}
              className={`min-h-11 w-full rounded-lg border ${Neutros.borde} bg-white px-4 py-2 focus:ring-2 ${AppColors.green.focusRing}`}
            >
              {DURACIONES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <FormInput
            id="agenda-hora-inicio"
            title="Desde"
            type="time"
            required
            value={horaInicio}
            onChange={setHoraInicio}
          />
          <FormInput
            id="agenda-hora-fin"
            title="Hasta"
            type="time"
            required
            value={horaFin}
            onChange={setHoraFin}
          />
          <button
            type="submit"
            disabled={guardando}
            className={`min-h-11 rounded-lg px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 ${Neutros.foco} ${AppColors.green.bg} ${AppColors.green.hover}`}
          >
            {guardando ? "Guardando…" : "Agregar a mi agenda"}
          </button>
        </form>
        {error && (
          <p role="alert" className={`mt-4 ${AppColors.red.text}`}>
            {error}
          </p>
        )}
        {mensaje && (
          <p role="status" className={`mt-4 ${AppColors.green.text}`}>
            {mensaje}
          </p>
        )}
      </section>

      <section aria-labelledby="agenda-lista" className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="agenda-lista"
            className={`text-lg font-semibold ${Neutros.titulo}`}
          >
            Próximos turnos
          </h2>
          {error && (
            <button
              type="button"
              onClick={recargar}
              className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${Neutros.foco} ${AppColors.green.text} ${Neutros.hoverSuave}`}
            >
              Reintentar
            </button>
          )}
        </div>
        {cargando ? (
          <p role="status" className={`mt-3 ${Neutros.textoSuave}`}>
            Cargando agenda…
          </p>
        ) : turnos.length === 0 ? (
          <p className={`mt-3 ${Neutros.textoSuave}`}>
            Todavía no agregaste horarios disponibles.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {turnos.map((turno) => {
              const disponible = turno.estado === "disponible";
              return (
                <li
                  key={turno.id_disponibilidad}
                  className={`flex items-center justify-between gap-3 rounded-xl border ${Neutros.bordeTarjeta} bg-white p-4`}
                >
                  <div>
                    <p className={`font-medium ${Neutros.titulo}`}>
                      {formatearFranja(
                        turno.fecha,
                        turno.hora_inicio,
                        turno.hora_fin,
                      )}
                    </p>
                    <p
                      className={`mt-1 text-sm ${disponible ? AppColors.green.text : Neutros.textoSuave}`}
                    >
                      {disponible ? "Disponible" : "Reservado"}
                    </p>
                  </div>
                  {disponible && (
                    <button
                      type="button"
                      onClick={() => void quitarTurno(turno.id_disponibilidad)}
                      disabled={guardando}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${Neutros.borde} ${AppColors.red.text} ${Neutros.foco}`}
                    >
                      Quitar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}
