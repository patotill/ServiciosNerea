import type { EstadoReserva, Reserva } from "../../types/reserva";
import StatCard from "./statCard";

export default function ResumenReservas({ reservas }: { reservas: Reserva[] }) {
  const contar = (estado: EstadoReserva) =>
    reservas.filter((r) => r.estado === estado).length;

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <StatCard titulo="Pendientes" valor={contar("pendiente")} color="gray" />
      <StatCard titulo="Confirmadas" valor={contar("confirmada")} color="blue" />
      <StatCard titulo="Completadas" valor={contar("completada")} color="green" />
    </section>
  );
}
