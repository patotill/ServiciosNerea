import { useEffect, useId, useRef, type PropsWithChildren } from "react";
import { Neutros } from "../../utils/colors";

type DialogoProps = PropsWithChildren<{
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
}>;

/** Modal sobre <dialog> nativo: foco atrapado, Esc cierra y devuelve el foco a quien lo abrió. */
export default function Dialogo({ abierto, titulo, onCerrar, children }: DialogoProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
      className={`m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border ${Neutros.bordeTarjeta} p-0 shadow-lg backdrop:bg-slate-900/50`}
    >
      <div className="p-6">
        <h2 id={idTitulo} className="text-xl font-bold text-slate-800">
          {titulo}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
