import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Supabase } from "../../utils/supabase";

export default function ProfesionalDashboard() {
  const [trabajos, setTrabajos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarTrabajosReales() {
      try {
        const response = await Supabase.getAll("reserva" as any);

        if (response.success && response.data) {
          setTrabajos(response.data);
        } else {
          console.error("Error al traer los datos:", response.error);
        }
      } catch (error) {
        console.error("Ocurrió un error inesperado:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarTrabajosReales();
  }, []);

  const totalTrabajos = trabajos.length;
  const enProceso = trabajos.filter(
    (t) => t.estado === "en proceso" || t.estado === "activo"
  ).length;
  const finalizados = trabajos.filter(
    (t) => t.estado === "finalizado" || t.estado === "completada"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-emerald-700 px-6 py-5 text-white shadow">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">NEREA</h1>
          <p className="text-sm text-emerald-100">
            Portal del profesional
          </p>
        </div>

        <Link
          to="/"
          className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Cerrar sesión
        </Link>
      </header>

      <main className="mx-auto max-w-6xl p-6 md:p-8">
        <section>
          <p className="font-medium text-emerald-700">
            PANEL DEL PROFESIONAL
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            ¡Bienvenido, profesional!
          </h2>

          <p className="mt-2 text-slate-500">
            Organizá tu jornada y consultá los trabajos asignados.
          </p>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Trabajos asignados
              </p>
              <span className="text-2xl">🧰</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-700">
              {totalTrabajos}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Registros totales
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                En proceso
              </p>
              <span className="text-2xl">🔧</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-amber-600">
              {enProceso}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Reparaciones en curso o activas
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Finalizados
              </p>
              <span className="text-2xl">✅</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-green-600">
              {finalizados}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Trabajos completados
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            Mi agenda
          </h3>

          <p className="mt-2 text-slate-500">
            Horarios previstos para tus servicios.
          </p>

          {cargando ? (
            <p className="mt-4 text-slate-500">Cargando agenda...</p>
          ) : trabajos.length === 0 ? (
            <p className="mt-4 text-slate-500">No hay servicios en agenda.</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {trabajos.slice(0, 2).map((t, idx) => (
                <div
                  key={t.id_reserva || idx}
                  className={`rounded-xl p-4 ${
                    idx === 0 ? "bg-emerald-50" : "bg-blue-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      idx === 0 ? "text-emerald-700" : "text-blue-700"
                    }`}
                  >
                    {t.fecha_creacion
                      ? new Date(t.fecha_creacion).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Horario flexible"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {t.tipo_reserva || "Servicio general"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    ID Reserva: #{t.id_reserva}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            Mis trabajos
          </h3>

          <p className="mt-2 text-slate-500">
            Consultá los detalles y el estado de cada reparación.
          </p>

          <div className="mt-6 space-y-4">
            {cargando ? (
              <p className="text-slate-500">Cargando trabajos...</p>
            ) : trabajos.length === 0 ? (
              <p className="text-slate-500">
                No se encontraron reservas registradas.
              </p>
            ) : (
              trabajos.map((trabajo, index) => (
                <article
                  key={trabajo.id_reserva || index}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {trabajo.tipo_reserva || "Servicio"}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Reserva #{trabajo.id_reserva}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        <strong>Descripción:</strong>{" "}
                        {trabajo.descripcion_trabajo || "Sin descripción"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {trabajo.fecha_creacion
                          ? new Date(trabajo.fecha_creacion).toLocaleString()
                          : "Fecha no disponible"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        trabajo.estado === "Finalizado" ||
                        trabajo.estado === "finalizado"
                          ? "bg-green-100 text-green-700"
                          : trabajo.estado === "En proceso" ||
                            trabajo.estado === "en proceso"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {trabajo.estado ? trabajo.estado.toUpperCase() : "ACTIVO"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Detalle de la reserva #${trabajo.id_reserva}: ${
                          trabajo.descripcion_trabajo || "Sin descripción"
                        }`
                      )
                    }
                    className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Ver trabajo
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          © 2026 Servicios y Reparaciones NEREA
        </footer>
      </main>
    </div>
  );
}