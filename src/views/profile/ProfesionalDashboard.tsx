import { Link } from "react-router-dom";

const trabajos = [
  {
    id: "T-101",
    servicio: "Reparación eléctrica",
    cliente: "Cliente de demostración",
    fecha: "13/10/2026",
    horario: "09:00",
    estado: "Asignado",
  },
  {
    id: "T-102",
    servicio: "Reparación de grifo",
    cliente: "Cliente de demostración",
    fecha: "13/10/2026",
    horario: "14:00",
    estado: "En proceso",
  },
  {
    id: "T-103",
    servicio: "Mantenimiento del hogar",
    cliente: "Cliente de demostración",
    fecha: "12/10/2026",
    horario: "11:00",
    estado: "Finalizado",
  },
];

export default function ProfesionalDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior */}
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
        {/* Bienvenida */}
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

        {/* Resumen */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Trabajos asignados
              </p>
              <span className="text-2xl">🧰</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-700">
              2
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Trabajos pendientes o en curso
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
              1
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Reparaciones en curso
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
              1
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Trabajos completados
            </p>
          </div>
        </section>

        {/* Agenda */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            Mi agenda
          </h3>

          <p className="mt-2 text-slate-500">
            Horarios previstos para tus servicios.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">
                09:00
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                Reparación eléctrica
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Trabajo T-101
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">
                14:00
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                Reparación de grifo
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Trabajo T-102
              </p>
            </div>
          </div>
        </section>

        {/* Trabajos */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            Mis trabajos
          </h3>

          <p className="mt-2 text-slate-500">
            Consultá los detalles y el estado de cada reparación.
          </p>

          <div className="mt-6 space-y-4">
            {trabajos.map((trabajo) => (
              <article
                key={trabajo.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {trabajo.servicio}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Trabajo {trabajo.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {trabajo.cliente}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {trabajo.fecha} · {trabajo.horario}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      trabajo.estado === "Finalizado"
                        ? "bg-green-100 text-green-700"
                        : trabajo.estado === "En proceso"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {trabajo.estado}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Detalle del trabajo ${trabajo.id}: próximamente`,
                    )
                  }
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Ver trabajo
                </button>
              </article>
            ))}
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          © 2026 Servicios y Reparaciones NEREA
        </footer>
      </main>
    </div>
  );
}