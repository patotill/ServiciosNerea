import AppColors, { Neutros } from "../../utils/colors";
import { FORMA_CONTROL } from "../../utils/estilos";

type BotonAccionProps = {
  texto: string;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: keyof typeof AppColors;
  disabled?: boolean;
  /** Describe a qué fila apunta el botón para lectores de pantalla. */
  etiqueta?: string;
};

export default function BotonAccion({
  texto,
  onClick,
  type = "button",
  color = "gray",
  disabled,
  etiqueta,
}: BotonAccionProps) {
  const colores = AppColors[color];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      className={`${FORMA_CONTROL} text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colores.bg} ${colores.hover} ${Neutros.foco}`}
    >
      {texto}
    </button>
  );
}
