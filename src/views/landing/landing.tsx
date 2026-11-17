import { Link } from "react-router-dom";
import LayoutPublico from "../../components/layout/layoutPublico";
import useServicios from "../../hooks/servicios/useServicios";
import { ROUTES } from "../../router/routes";
import AppColors, { Neutros } from "../../utils/colors";

const PASOS = [
  {
    titulo: "Buscá por rubro",
    texto: "Elegí plomería, electricidad, gas u otro rubro y mirá quiénes trabajan en eso.",
  },
  {
    titulo: "Revisá la matrícula",
    texto: "Cada perfil muestra si el profesional tiene la matrícula cargada, en revisión o verificada.",
  },
  {
    titulo: "Creá tu cuenta",
    texto: "Registrate como cliente para reservar un turno con el profesional que elijas.",
  },
];

const azul = AppColors.blue;
const botonBase =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 font-semibold transition-colors";

export default function Landing() {
  const { servicios, cargando, error } = useServicios();

  return (
    <LayoutPublico titulo="Inicio">
      <div className="flex flex-col gap-10 sm:gap-14">
        <section aria-labelledby="hero" className="pt-4 sm:pt-8">
          <h2
            id="hero"
            className={`max-w-2xl text-3xl font-bold ${Neutros.titulo} sm:text-5xl`}
          >
            Encontrá al profesional indicado para tu arreglo
          </h2>
          <p className={`mt-4 max-w-xl text-base sm:text-lg ${Neutros.texto}`}>
            Plomeros, electricistas, albañiles, pintores y gasistas en un solo
            lugar, con la matrícula a la vista. Creá una cuenta para reservar un turno.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to={ROUTES.PUBLICO}
              className={`${botonBase} ${Neutros.foco} ${azul.bg} ${azul.hover} text-white`}
            >
              Ver profesionales
            </Link>
            <Link
              to={ROUTES.REGISTRO_CLIENTE}
              className={`${botonBase} ${Neutros.foco} border-2 ${azul.border} ${azul.text} ${azul.linkHover}`}
            >
              Crear cuenta
            </Link>
          </div>
        </section>

        <section aria-labelledby="rubros">
          <h2 id="rubros" className={`text-2xl font-bold ${Neutros.titulo}`}>
            Qué necesitás resolver
          </h2>
          <p className={`mt-1 ${Neutros.texto}`}>
            Tocá un rubro y mirá los profesionales que lo atienden.
          </p>
          <div className="mt-4" aria-busy={cargando}>
            {cargando ? (
              <>
              <p role="status" className="sr-only">Cargando rubros…</p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <li
                    key={n}
                    className="h-24 animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none"
                  />
                ))}
              </ul>
              </>
            ) : error ? (
              <p role="alert" className={AppColors.red.text}>
                No pudimos cargar los rubros. Recargá la página o{" "}
                <Link to={ROUTES.PUBLICO} className="underline">
                  mirá todos los profesionales
                </Link>
                .
              </p>
            ) : servicios.length === 0 ? (
              <p className={Neutros.texto}>
                Todavía no hay rubros cargados.{" "}
                <Link to={ROUTES.PUBLICO} className={`${azul.text} underline`}>
                  Ver profesionales
                </Link>
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {servicios.map((s) => (
                  <li key={s.id_servicio}>
                    <Link
                      to={`${ROUTES.PUBLICO}?rubro=${s.id_servicio}`}
                      className={`block min-h-24 rounded-lg border bg-white p-4 transition-colors ${Neutros.borde} ${azul.linkHover} ${Neutros.foco}`}
                    >
                      <span className={`block font-semibold ${Neutros.titulo}`}>
                        {s.nombre}
                      </span>
                      {s.descripcion && (
                        <span
                          className={`mt-1 line-clamp-2 block text-sm ${Neutros.texto}`}
                        >
                          {s.descripcion}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="como-funciona">
          <h2 id="como-funciona" className={`text-2xl font-bold ${Neutros.titulo}`}>
            Cómo funciona
          </h2>
          <p className={`mt-1 max-w-xl ${Neutros.texto}`}>
            Tres pasos para encontrar a alguien de confianza.
          </p>
          <ol className="mt-4 grid gap-6 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="flex gap-4 md:block">
                <span
                  className={`text-4xl font-bold leading-none ${azul.text}`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="md:mt-2">
                  <h3 className={`font-semibold ${Neutros.titulo}`}>{p.titulo}</h3>
                  <p className={`mt-1 text-sm ${Neutros.texto}`}>{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="profesionales"
          className={`rounded-xl p-6 text-white sm:p-8 ${azul.bg}`}
        >
          <h2 id="profesionales" className="text-2xl font-bold">
            ¿Trabajás en un oficio?
          </h2>
          <p className="mt-2 max-w-xl">
            Creá tu perfil y cargá tu matrícula para que los clientes la vean.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to={ROUTES.REGISTRO_PROFESIONAL}
              className={`${botonBase} ${Neutros.focoClaro} bg-white ${azul.text} ${azul.linkHover}`}
            >
              Soy profesional
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className={`inline-flex min-h-11 items-center underline ${Neutros.focoClaro}`}
            >
              Ya tengo cuenta, iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </LayoutPublico>
  );
}
