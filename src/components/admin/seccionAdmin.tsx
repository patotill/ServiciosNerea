import type { PropsWithChildren } from "react";
import AppColors, { Neutros } from "../../utils/colors";

type SeccionAdminProps = PropsWithChildren<{
  titulo: string;
  cargando: boolean;
  error: string | null;
}>;

/** Tarjeta de una sección del panel con sus estados de carga y error. */
export default function SeccionAdmin({
  titulo,
  cargando,
  error,
  children,
}: SeccionAdminProps) {
  return (
    <section className={`mt-8 rounded-2xl border ${Neutros.bordeTarjeta} bg-white p-4 shadow-sm sm:p-6`}>
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      {error && (
        <p role="alert" className={`mt-3 text-sm font-medium ${AppColors.red.text}`}>
          {error}
        </p>
      )}
      {cargando ? (
        <p role="status" className={`mt-4 ${Neutros.textoSuave}`}>
          Cargando…
        </p>
      ) : (
        <div className="mt-4">{children}</div>
      )}
    </section>
  );
}
