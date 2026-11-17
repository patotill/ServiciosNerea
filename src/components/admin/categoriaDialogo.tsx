import { useState, type FormEvent } from "react";
import type { CategoriaAdmin, DatosCategoria } from "../../types/admin";
import AppColors from "../../utils/colors";
import Dialogo from "../containers/dialogo";
import { FormInput } from "../inputs/formInput";
import BotonAccion from "./botonAccion";

type CategoriaDialogoProps = {
  /** null = cerrado; "nueva" = alta; una categoría = edición con datos precargados. */
  categoria: CategoriaAdmin | "nueva" | null;
  ocupado: boolean;
  error: string | null;
  onGuardar: (datos: DatosCategoria) => void;
  onCerrar: () => void;
};

export default function CategoriaDialogo({
  categoria,
  ocupado,
  error,
  onGuardar,
  onCerrar,
}: CategoriaDialogoProps) {
  const editando = categoria !== null && categoria !== "nueva";

  return (
    <Dialogo
      abierto={categoria !== null}
      titulo={editando ? "Editar categoría" : "Nueva categoría"}
      onCerrar={onCerrar}
    >
      {/* Se monta solo con el diálogo abierto, así el estado arranca limpio cada vez. */}
      {categoria !== null && (
        <Formulario
          inicial={
            editando
              ? { nombre: categoria.nombre, descripcion: categoria.descripcion ?? "" }
              : { nombre: "", descripcion: "" }
          }
          textoGuardar={editando ? "Guardar" : "Crear"}
          ocupado={ocupado}
          error={error}
          onGuardar={onGuardar}
          onCerrar={onCerrar}
        />
      )}
    </Dialogo>
  );
}

type FormularioProps = {
  inicial: DatosCategoria;
  textoGuardar: string;
  ocupado: boolean;
  error: string | null;
  onGuardar: (datos: DatosCategoria) => void;
  onCerrar: () => void;
};

function Formulario({
  inicial,
  textoGuardar,
  ocupado,
  error,
  onGuardar,
  onCerrar,
}: FormularioProps) {
  const [datos, setDatos] = useState(inicial);

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (datos.nombre.trim()) onGuardar(datos);
  }

  return (
    <form onSubmit={enviar} className="mt-4 grid gap-3">
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
      {error && (
        <p role="alert" className={`text-sm font-medium ${AppColors.red.text}`}>
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <BotonAccion texto="Cancelar" onClick={onCerrar} />
        <BotonAccion type="submit" color="blue" texto={textoGuardar} disabled={ocupado} />
      </div>
    </form>
  );
}
