import { Link } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import AppColors, { Neutros } from "../../utils/colors";
import type { ProfesionalPublico } from "../../types/profesional";
import type { Servicio } from "../../types/servicios";
import MatriculaBadge from "./matriculaBadge";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

export default function ProfesionalCard({
  profesional,
  rubros,
}: {
  profesional: ProfesionalPublico;
  rubros: Servicio[];
}) {
  const descripciones = profesional.ids_servicio.flatMap((id) => {
    const descripcion = rubros.find((rubro) => rubro.id_servicio === id)?.descripcion;
    return descripcion ? [{ id, descripcion }] : [];
  });

  return (
    <article className={`flex w-full min-w-0 flex-col gap-3 rounded-xl border ${Neutros.bordeTarjeta} bg-white p-4`}>
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700"
        >
          {iniciales(profesional.nombre)}
        </div>
        <div className="min-w-0">
          <h2 className={`wrap-break-word font-semibold ${Neutros.titulo}`}>{profesional.nombre}</h2>
          <p className={`text-sm ${Neutros.textoSuave}`}>
            {profesional.codigo_postal
              ? `CP ${profesional.codigo_postal}`
              : "Zona sin informar"}
          </p>
        </div>
      </div>
      <MatriculaBadge estado={profesional.estado_matricula} />
      <p className="text-sm font-medium text-slate-700">
        {profesional.servicios.length > 0
          ? profesional.servicios.join(", ")
          : "Sin rubros cargados"}
      </p>
      {descripciones.length > 0 && (
        <div className={`space-y-1 text-sm ${Neutros.textoSuave}`}>
          {descripciones.map((rubro) => (
            <p key={rubro.id}>{rubro.descripcion}</p>
          ))}
        </div>
      )}
      <Link
        to={`${ROUTES.RESERVAR}/${profesional.id_profesional}`}
        className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-semibold text-white ${Neutros.foco} ${AppColors.blue.bg} ${AppColors.blue.hover}`}
      >
        Ver turnos y reservar
      </Link>
    </article>
  );
}
