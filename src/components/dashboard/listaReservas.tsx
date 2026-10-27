import type { Reserva } from "../../types/reserva";
import ReservaCard from "./reservaCard";

type ListaReservasProps = {
  reservas: Reserva[];
  cargando: boolean;
  esMock: boolean;
  titulo: string;
};

export default function ListaReservas({
  reservas,
  cargando,
  esMock,
  titulo,
}: ListaReservasProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      {esMock && (
        <p className="mt-2 text-sm text-slate-500">
          Todavía no hay reservas cargadas: se muestran datos de ejemplo.
        </p>
      )}
      <div className="mt-5 space-y-4">
        {cargando ? (
          <p role="status" className="text-slate-600">Cargando reservas…</p>
        ) : (
          reservas.map((reserva) => (
            <ReservaCard key={reserva.id_reserva} reserva={reserva} />
          ))
        )}
      </div>
    </section>
  );
}
