import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Supabase } from "../../utils/supabase";

export default function ClienteDashboard() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

 
  useEffect(() => {
    async function cargarDatosReales() {
      try {
    
        const response = await Supabase.getAll("cliente" as any);

        if (response.data) {
          console.log("Datos reales de Supabase:", response.data);
          setSolicitudes(response.data);
        } else {
          console.error("Error al traer los datos:", response.error);
        }
      } catch (error) {
        console.error("Ocurrió un error inesperado:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosReales();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-blue-700 px-6 py-5 text-white shadow">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            NEREA
          </h1>
          <p className="text-sm text-blue-100">
            Servicios y Reparaciones
          </p>
        </div>

        <Link
          to="/"
          className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Cerrar sesión
        </Link>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-6xl p-6 md:p-8">
        <section>
          <p className="font-medium text-blue-700">
            PANEL DE CLIENTE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            ¡Hola, bienvenido!
          </h2>

          <p className="mt-2 text-slate-500">
            Desde aquí podés gestionar tus reparaciones y consultar
            el estado de tus solicitudes.
          </p>
        </section>

        {/* Resumen dinámico según los datos */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total de registros
              </p>
              <span className="text-2xl">📋</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {solicitudes.length}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Registros en la base de datos
            </p>
          </div>
        </section>

        {/* Acciones */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            ¿Necesitás una reparación?
          </h3>

          <p className="mt-2 text-slate-500">
            Solicitá un servicio para que podamos ayudarte.
          </p>

          <button
            type="button"
            onClick={() =>
              alert("La solicitud de reparación estará disponible próximamente.")
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Solicitar reparación
          </button>
        </section>

        {/* Listado de solicitudes (Conectado a Supabase) */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Mis reparaciones (Datos de Supabase)
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Consultá el estado de tus solicitudes reales.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {cargando ? (
              <p className="text-slate-500">Cargando datos desde la base de datos...</p>
            ) : solicitudes.length === 0 ? (
              <p className="text-slate-500">No se encontraron registros cargados por tus compañeros.</p>
            ) : (
              solicitudes.map((solicitud, index) => (
                <article
                  key={solicitud.id_cliente || index}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      ID de Registro: {solicitud.id_cliente || "N/A"}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      ID de Usuario (Auth): {solicitud.id_usuario || "Sin asociar"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Creado el: {solicitud.created_at ? new Date(solicitud.created_at).toLocaleString() : "Fecha no disponible"}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Activo
                  </span>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Pie de página */}
        <footer className="py-8 text-center text-sm text-slate-400">
          © 2026 Servicios y Reparaciones NEREA
        </footer>
      </main>
    </div>
  );
}