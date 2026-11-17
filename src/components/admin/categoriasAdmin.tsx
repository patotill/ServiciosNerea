import { useState, type FormEvent } from "react";
import type { CategoriaAdmin, DatosCategoria } from "../../types/admin";
import { Neutros } from "../../utils/colors";
import { FormInput } from "../inputs/formInput";
import BotonAccion from "./botonAccion";

type CategoriasAdminProps = {
  categorias: CategoriaAdmin[];
  ocupado: boolean;
  onGuardar: (datos: DatosCategoria, idServicio: number | null) => Promise<boolean>;
  onBorrar: (idServicio: number) => void;
};

const VACIA: DatosCategoria = { nombre: "", descripcion: "" };

export default function CategoriasAdmin({
  categorias,
  ocupado,
  onGuardar,
  onBorrar,
}: CategoriasAdminProps) {
  const [editando, setEditando] = useState<number | null>(null);
  const [datos, setDatos] = useState<DatosCategoria>(VACIA);

  function empezarEdicion(c: CategoriaAdmin) {
    setEditando(c.id_servicio);
    setDatos({ nombre: c.nombre, descripcion: c.descripcion ?? "" });
  }

  function limpiar() {
    setEditando(null);
    setDatos(VACIA);
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!datos.nombre.trim()) return;
    if (await onGuardar(datos, editando)) limpiar();
  }

  function pedirBorrado(c: CategoriaAdmin) {
    if (window.confirm(`¿Borrar la categoría "${c.nombre}"?`)) onBorrar(c.id_servicio);
  }

  return (
    <>
      <form onSubmit={enviar} className="grid gap-3 sm:grid-cols-2">
        <FormInput
          id="categoria-nombre"
          title="Nombre"
          required
          value={datos.nombre}
          onChange={(nombre) => setDatos((d) => ({ ...d, nombre }))}
        />
        <FormInput
          id="categoria-descripcion"
          title="Descripción"
          value={datos.descripcion}
          onChange={(descripcion) => setDatos((d) => ({ ...d, descripcion }))}
        />
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <BotonAccion
            type="submit"
            color="blue"
            texto={editando === null ? "Crear categoría" : "Guardar cambios"}
            disabled={ocupado}
          />
          {editando !== null && <BotonAccion texto="Cancelar" onClick={limpiar} />}
        </div>
      </form>

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
                onClick={() => empezarEdicion(c)}
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
    </>
  );
}
