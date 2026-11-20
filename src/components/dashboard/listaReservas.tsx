import type { Reserva } from "../../types/reserva";
import AppColors, { Neutros } from "../../utils/colors";
import ReservaCard from "./reservaCard";

type ListaReservasProps = {
  reservas: Reserva[];
  cargando: boolean;
  error: string | null;
  recargar: () => void;
  titulo: string;
};

export default function ListaReservas({
  reservas,
  cargando,
  error,
  recargar,
  titulo,
}: ListaReservasProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      <div className="mt-5 space-y-4">
        {cargando ? (
          <p role="status" className="text-slate-600">Cargando reservas…</p>
        ) : error ? (
          <div role="alert">
            <p className={AppColors.red.text}>{error}</p>
            <button
              type="button"
              onClick={recargar}
              className={`mt-2 min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${AppColors.blue.text} ${Neutros.hoverSuave} ${Neutros.foco}`}
            >
              Reintentar
            </button>
          </div>
        ) : reservas.length === 0 ? (
          <p className="text-slate-600">Todavía no tenés reservas.</p>
        ) : (
          reservas.map((reserva) => (
            <ReservaCard key={reserva.id_reserva} reserva={reserva} />
          ))
        )}
      </div>
    </section>
  );
}
