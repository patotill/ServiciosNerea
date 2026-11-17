import type { MatriculaAdmin } from "../../types/admin";
import { Neutros } from "../../utils/colors";
import EstadoBadge from "../dashboard/estadoBadge";
import BotonAccion from "./botonAccion";

type MatriculasAdminProps = {
  matriculas: MatriculaAdmin[];
  ocupado: boolean;
  onVerificar: (idMatricula: number) => void;
  onRechazar: (idMatricula: number) => void;
};

export default function MatriculasAdmin({
  matriculas,
  ocupado,
  onVerificar,
  onRechazar,
}: MatriculasAdminProps) {
  if (matriculas.length === 0) {
    return <p className={Neutros.textoSuave}>Todavía no hay matrículas cargadas.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {matriculas.map((m) => {
        const profesional = m.profesional?.usuario?.nombre ?? "Profesional sin nombre";
        const categoria = m.servicio_categoria?.nombre ?? "Sin categoría";

        return (
          <li
            key={m.id_matricula}
            className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className={`font-medium ${Neutros.titulo}`}>{profesional}</p>
              <p className={`text-sm ${Neutros.textoSuave}`}>
                {categoria} · Matrícula {m.numero}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <EstadoBadge estado={m.estado_verificacion} />
              {m.estado_verificacion === "pendiente" && (
                <>
                  <BotonAccion
                    texto="Verificar"
                    etiqueta={`Verificar matrícula de ${profesional}`}
                    color="green"
                    disabled={ocupado}
                    onClick={() => onVerificar(m.id_matricula)}
                  />
                  <BotonAccion
                    texto="Rechazar"
                    etiqueta={`Rechazar matrícula de ${profesional}`}
                    color="red"
                    disabled={ocupado}
                    onClick={() => onRechazar(m.id_matricula)}
                  />
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
