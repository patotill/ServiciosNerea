import { useRef } from "react";
import LayoutPublico from "../../components/layout/layoutPublico";
import { FormInput } from "../../components/inputs/formInput";
import useServicios from "../../hooks/servicios/useServicios";
import useProfesionales from "../../hooks/profesionales/useProfesionales";
import Paginador from "../../components/navigation/paginador";
import AppColors, { Neutros } from "../../utils/colors";
import ProfesionalCard from "./profesionalCard";

export default function ProfesionalesPublico() {
  const { servicios } = useServicios();
  const {
    nombre,
    setNombre,
    codigoPostal,
    setCodigoPostal,
    idServicio,
    cambiarRubro,
    cargando,
    error,
    profesionales,
    pagina,
    totalPaginas,
    cambiarPagina,
    reintentar,
  } = useProfesionales();
  const resultadosRef = useRef<HTMLElement>(null);

  // En el celular el paginador queda al pie de la lista: se vuelve al inicio de los resultados.
  const irAPagina = (n: number) => {
    cambiarPagina(n);
    resultadosRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <LayoutPublico titulo="Profesionales">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <FormInput
          id="buscar-nombre"
          title="Nombre"
          type="search"
          placeholder="Ej: Pérez"
          value={nombre}
          onChange={setNombre}
        />
        <div>
          <label htmlFor="filtro-rubro" className="mb-1 block text-sm font-medium text-gray-700">
            Rubro
          </label>
          <select
            id="filtro-rubro"
            value={idServicio ?? ""}
            onChange={(e) => cambiarRubro(e.target.value ? Number(e.target.value) : null)}
            className={`min-h-11 w-full rounded-lg border ${Neutros.borde} bg-white px-4 py-2 outline-none focus:ring-2 ${AppColors.blue.focusRing}`}
          >
            <option value="">Todos</option>
            {servicios.map((s) => (
              <option key={s.id_servicio} value={s.id_servicio}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <FormInput
          id="filtro-cp"
          title="Código postal"
          placeholder="Ej: 1425"
          value={codigoPostal}
          onChange={setCodigoPostal}
        />
      </form>

      <section ref={resultadosRef} aria-label="Resultados" className="mt-6 scroll-mt-4">
        {cargando ? (
          <p role="status" className={Neutros.textoSuave}>
            Buscando profesionales…
          </p>
        ) : error ? (
          <div role="alert" className="flex flex-col items-start gap-3">
            <p className={AppColors.red.text}>{error}</p>
            <button
              type="button"
              onClick={reintentar}
              className={`min-h-11 rounded-lg px-4 py-2 font-medium text-white ${AppColors.blue.bg} ${AppColors.blue.hover} ${Neutros.foco}`}
            >
              Reintentar
            </button>
          </div>
        ) : profesionales.length === 0 ? (
          <p role="status" className={Neutros.textoSuave}>
            No hay profesionales con esos filtros. Probá con otro rubro o borrá el código postal.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profesionales.map((p) => (
              <li key={p.id_profesional} className="flex">
                <ProfesionalCard profesional={p} />
              </li>
            ))}
          </ul>
        )}
        <Paginador paginaActual={pagina} totalPaginas={totalPaginas} onCambiar={irAPagina} />
      </section>
    </LayoutPublico>
  );
}
