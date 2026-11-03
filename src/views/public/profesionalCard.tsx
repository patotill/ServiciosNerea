import { descripcionMock, localidadMock } from "../../data/mockProfesionales";
import { Neutros } from "../../utils/colors";
import type { ProfesionalPublico } from "../../types/profesional";
import MatriculaBadge from "./matriculaBadge";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

export default function ProfesionalCard({ profesional }: { profesional: ProfesionalPublico }) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700"
        >
          {iniciales(profesional.nombre)}
        </div>
        <div className="min-w-0">
          <h2 className={`break-words font-semibold ${Neutros.titulo}`}>{profesional.nombre}</h2>
          <p className={`text-sm ${Neutros.textoSuave}`}>{localidadMock(profesional.codigo_postal)}</p>
        </div>
      </div>
      <MatriculaBadge estado={profesional.estado_matricula} />
      <p className="text-sm font-medium text-slate-700">
        {profesional.servicios.length > 0
          ? profesional.servicios.join(", ")
          : "Sin rubros cargados"}
      </p>
      <p className={`text-sm ${Neutros.textoSuave}`}>
        {profesional.descripcion ?? descripcionMock(profesional.servicios)}
      </p>
    </article>
  );
}
