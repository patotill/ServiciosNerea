import type { EstadoMatriculaPublica } from "../../types/profesional";
import AppColors from "../../utils/colors";

const BADGE: Record<
  EstadoMatriculaPublica,
  { texto: string; color: keyof typeof AppColors }
> = {
  verificada: { texto: "Matrícula verificada", color: "green" },
  pendiente: { texto: "Matrícula en revisión", color: "gray" },
  sin_matricula: { texto: "Sin matrícula cargada", color: "red" },
};

// RF-19, RN-05: el estado de la matrícula se muestra siempre, con texto y no solo con color.
export default function MatriculaBadge({ estado }: { estado: EstadoMatriculaPublica }) {
  const { texto, color } = BADGE[estado];
  return (
    <span
      className={`w-fit rounded-md px-2.5 py-1 text-sm font-medium text-white ${AppColors[color].bg}`}
    >
      {texto}
    </span>
  );
}
