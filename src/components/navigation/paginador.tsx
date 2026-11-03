import AppColors, { Neutros } from "../../utils/colors";

type PaginadorProps = {
  paginaActual: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
};

type Elemento = number | "salto";

// Primera, última y la actual con una vecina a cada lado; los huecos se marcan con "salto".
function elementosVisibles(actual: number, total: number): Elemento[] {
  const paginas = [...new Set([1, actual - 1, actual, actual + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  return paginas.flatMap((p, i) =>
    i > 0 && p - paginas[i - 1] > 1 ? (["salto", p] as Elemento[]) : [p],
  );
}

const BOTON_BASE = `min-h-11 min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${Neutros.foco}`;
const BOTON_INACTIVO = `${Neutros.borde} bg-white ${Neutros.texto} ${Neutros.hoverSuave} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`;
const BOTON_ACTIVO = `${AppColors.blue.border} ${AppColors.blue.bg} text-white`;

export default function Paginador({ paginaActual, totalPaginas, onCambiar }: PaginadorProps) {
  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onCambiar(paginaActual - 1)}
        disabled={paginaActual <= 1}
        className={`${BOTON_BASE} ${BOTON_INACTIVO}`}
      >
        Anterior
      </button>

      <p className={`px-2 text-sm sm:hidden ${Neutros.texto}`}>
        Página {paginaActual} de {totalPaginas}
      </p>

      <ul className="hidden items-center gap-2 sm:flex">
        {elementosVisibles(paginaActual, totalPaginas).map((el, i) =>
          el === "salto" ? (
            <li key={`salto-${i}`} aria-hidden="true" className={Neutros.textoSuave}>
              …
            </li>
          ) : (
            <li key={el}>
              <button
                type="button"
                onClick={() => onCambiar(el)}
                aria-current={el === paginaActual ? "page" : undefined}
                aria-label={`Página ${el}`}
                className={`${BOTON_BASE} ${el === paginaActual ? BOTON_ACTIVO : BOTON_INACTIVO}`}
              >
                {el}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onCambiar(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas}
        className={`${BOTON_BASE} ${BOTON_INACTIVO}`}
      >
        Siguiente
      </button>
    </nav>
  );
}
