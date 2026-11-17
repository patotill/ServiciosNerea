import { useState } from "react";
import type { CategoriaAdmin, DatosCategoria } from "../../types/admin";
import { Neutros } from "../../utils/colors";
import BotonAccion from "./botonAccion";
import CategoriaDialogo from "./categoriaDialogo";

type CategoriasAdminProps = {
  categorias: CategoriaAdmin[];
  ocupado: boolean;
  /** Error del último intento; se muestra dentro del diálogo si falló el guardado. */
  error: string | null;
  onGuardar: (datos: DatosCategoria, idServicio: number | null) => Promise<boolean>;
  onBorrar: (idServicio: number) => void;
};

export default function CategoriasAdmin({
  categorias,
  ocupado,
  error,
  onGuardar,
  onBorrar,
}: CategoriasAdminProps) {
  const [dialogo, setDialogo] = useState<CategoriaAdmin | "nueva" | null>(null);
  const [falloGuardado, setFalloGuardado] = useState(false);

  function abrir(categoria: CategoriaAdmin | "nueva") {
    setFalloGuardado(false);
    setDialogo(categoria);
  }

  async function guardar(datos: DatosCategoria) {
    const idServicio = dialogo !== null && dialogo !== "nueva" ? dialogo.id_servicio : null;
    const ok = await onGuardar(datos, idServicio);
    setFalloGuardado(!ok);
    if (ok) setDialogo(null);
  }

  function pedirBorrado(c: CategoriaAdmin) {
    if (window.confirm(`¿Borrar la categoría "${c.nombre}"?`)) onBorrar(c.id_servicio);
  }

  return (
    <>
      <BotonAccion texto="Nueva categoría" color="blue" onClick={() => abrir("nueva")} />

      <ul className="mt-4 divide-y divide-slate-100">
        {categorias.map((c) => (
          <li
            key={c.id_servicio}
            className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className={`font-medium ${Neutros.titulo}`}>{c.nombre}</p>
              {c.descripcion && (
                <p className={`text-sm ${Neutros.textoSuave}`}>{c.descripcion}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <BotonAccion
                texto="Editar"
                etiqueta={`Editar ${c.nombre}`}
                disabled={ocupado}
                onClick={() => abrir(c)}
              />
              <BotonAccion
                texto="Borrar"
                etiqueta={`Borrar ${c.nombre}`}
                color="red"
                disabled={ocupado}
                onClick={() => pedirBorrado(c)}
              />
            </div>
          </li>
        ))}
      </ul>

      <CategoriaDialogo
        categoria={dialogo}
        ocupado={ocupado}
        error={falloGuardado ? error : null}
        onGuardar={guardar}
        onCerrar={() => setDialogo(null)}
      />
    </>
  );
}
