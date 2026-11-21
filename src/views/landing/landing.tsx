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
    titulo: "Elegí a uno de nuestros profesionales",
    texto: "Cada perfil muestra especialistas con matrícula, garantizando trabajos de confianza.",
  },
  {
    titulo: "Creá tu cuenta",
    texto: "Registrate como cliente, reserva un turno con el profesional que elijas, se contacta con vos y listo!",
  },
];

const PASOS_PROFESIONAL = [
  {
    titulo: "Creá tu cuenta profesional",
    texto: "Completá tus datos de perfil, matrícula y ofrecete los rubros en los que trabajás.",
  },
  {
    titulo: "Manejá tus tiempos y tu agenda",
    texto: "Cargá tus días y horarios, publicás tu disponibilidad laboral.",
  },
  {
    titulo: "Gestioná tus reservas",
    texto:
      "Te ponemos en contato con los clientes y aceptás las solicitudes. Trabajos garantizados!",
  },
];

const RUBROS_DESTACADOS = [
  {
    nombre: "Albañilería",
    descripcion:
      "Arreglos generales, mampostería, construcción, revestimientos de paredes y estructuras.",
  },
  {
    nombre: "Electricidad",
    descripcion:
      "Instalaciones eléctricas, mantenimiento, reparaciones y diagnóstico de fallas.",
  },
  {
    nombre: "Gas",
    descripcion:
      "Instalación de artefactos, mantenimiento y reparaciones. Redes y tuberías para la conducción segura de gas.",
  },
  {
    nombre: "Pintura",
    descripcion:
      "Interior y exterior. Recubrimientos protectores, barnices y frentes estéticos.",
  },
  {
    nombre: "Plomería",
    descripcion:
      "Reparaciones de agua, cañerías, cloacas, artefactos y pérdidas.",
  },
];

const azul = AppColors.blue;
const verde = AppColors.green;
const tituloHero = "text-3xl font-bold sm:text-5xl";
const descripcionHero = "text-base sm:text-lg";
const botonBase =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 font-semibold transition-colors";

export default function Landing() {
  const { servicios, cargando, error } = useServicios();

  return (
    <LayoutPublico titulo="Inicio">
      <div className="flex flex-col gap-10 sm:gap-14">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <section
            aria-labelledby="hero"
            className="flex flex-col pt-4 sm:pt-8 lg:pb-8"
          >
            <h2
              id="hero"
              className={`max-w-2xl ${tituloHero} ${Neutros.titulo}`}
            >
              Necesitas una reparación o un servicio?
            </h2>
            <p className={`mt-4 max-w-xl ${descripcionHero} ${Neutros.texto}`}>
              Plomeros, electricistas, albañiles, pintores y gasistas en un solo
              lugar, con matrícula a la vista. Creá una cuenta para reservar un turno con un especialista de confianza.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-6">
              <Link
                to={ROUTES.PUBLICO}
                className={`${botonBase} ${Neutros.foco} ${azul.bg} ${azul.hover} text-white`}
              >
                Buscar profesionales
              </Link>
              <Link
                to={ROUTES.REGISTRO_CLIENTE}
                className={`${botonBase} ${Neutros.foco} border-2 ${azul.border} ${azul.text} ${azul.linkHover}`}
              >
                Crear cuenta
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="profesionales"
            className={`flex flex-col rounded-xl p-6 text-white sm:p-8 ${azul.bg}`}
          >
            <h2 id="profesionales" className={tituloHero}>
              Trabajás en un oficio?
            </h2>
            <p className={`mt-4 max-w-xl ${descripcionHero}`}>
              Creá tu perfil, cargá tu matrícula y ofrecé tus servicios garantizados. Tus clientes van a encontrarte más fácilmente aquí!
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-6">
              <Link
                to={ROUTES.REGISTRO_PROFESIONAL}
                className={`${botonBase} ${Neutros.focoClaro} bg-white ${azul.text} ${azul.linkHover}`}
              >
                Soy profesional
              </Link>
              <Link
                to={ROUTES.REGISTRO_PROFESIONAL}
                className={`${botonBase} ${Neutros.focoClaro} border-2 border-white text-white hover:bg-white/15`}
              >
                Crear cuenta
              </Link>
            </div>
          </section>
        </div>
        <section aria-labelledby="rubros">
          <h2 id="rubros" className={`text-2xl font-bold ${Neutros.titulo}`}>
            Qué necesitás resolver hoy?
          </h2>
          <p className={`mt-1 ${Neutros.texto}`}>
            Tocá un rubro y mirá los profesionales que lo atienden:
          </p>
          <div className="mt-4" aria-busy={cargando}>
            {cargando && (
              <p role="status" className="sr-only">
                Cargando rubros…
              </p>
            )}
            {error && (
              <p role="alert" className={AppColors.red.text}>
                No pudimos cargar los rubros. Recargá la página o{" "}
                <Link to={ROUTES.PUBLICO} className="underline">
                  mirá todos los profesionales
                </Link>
                .
              </p>
            )}
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RUBROS_DESTACADOS.map((rubro) => {
                const servicio = servicios.find(
                  (item) =>
                    item.nombre.trim().toLocaleLowerCase() ===
                    rubro.nombre.toLocaleLowerCase(),
                );
                const destino = servicio
                  ? `${ROUTES.PUBLICO}?rubro=${servicio.id_servicio}`
                  : ROUTES.PUBLICO;

                return (
                  <li key={rubro.nombre}>
                    <Link
                      to={destino}
                      className={`block h-32 rounded-lg border bg-gray-200 p-4 transition-colors ${Neutros.bordeTarjeta} ${azul.linkHover} ${Neutros.foco}`}
                    >
                      <span className={`block font-semibold ${Neutros.titulo}`}>
                        {rubro.nombre}
                      </span>
                      <span
                        className={`mt-1 line-clamp-2 block text-sm ${Neutros.texto}`}
                      >
                        {servicio?.descripcion || rubro.descripcion}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li key="otros-rubros">
                <Link
                  to={ROUTES.PUBLICO}
                  className={`block h-32 rounded-lg border bg-gray-200 p-4 transition-colors ${Neutros.bordeTarjeta} ${azul.linkHover} ${Neutros.foco}`}
                >
                  <span className={`block font-semibold ${Neutros.titulo}`}>
                    Otros rubros
                  </span>
                  <span className={`mt-1 block text-sm ${Neutros.texto}`}>
                    Encontrá todo tipo de especialistas en nuestro buscador.
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="como-funciona"
          className={`rounded-xl border bg-white p-5 sm:p-6 ${Neutros.bordeTarjeta}`}
        >
          <h2 id="como-funciona" className={`text-2xl font-bold ${Neutros.titulo}`}>
            Cómo funciona para clientes...
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
          aria-labelledby="como-funciona-profesional"
          className={`rounded-xl border bg-white p-5 text-right sm:p-6 ${Neutros.bordeTarjeta}`}
        >
          <h2
            id="como-funciona-profesional"
            className={`text-2xl font-bold ${Neutros.titulo}`}
          >
            Cómo funciona para profesionales...
          </h2>
          <p className={`mt-1 ml-auto max-w-xl ${Neutros.texto}`}>
            Tres pasos para brindar tus servicios.
          </p>
          <ol className="mt-4 grid gap-6 md:grid-cols-3">
            {PASOS_PROFESIONAL.map((paso, indice) => (
              <li
                key={paso.titulo}
                className="flex flex-row-reverse gap-4 text-right md:block"
              >
                <span
                  className={`text-4xl font-bold leading-none ${verde.text}`}
                  aria-hidden="true"
                >
                  {indice + 1}
                </span>
                <div className="md:mt-2">
                  <h3 className={`font-semibold ${Neutros.titulo}`}>
                    {paso.titulo}
                  </h3>
                  <p className={`mt-1 text-sm ${Neutros.texto}`}>
                    {paso.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="quienes-somos"
          className={`mx-auto w-full max-w-4xl rounded-xl border bg-gray-200 p-4 text-center sm:p-5 ${Neutros.bordeTarjeta}`}
        >
          <h2
            id="quienes-somos"
            className={`text-lg font-semibold italic ${Neutros.titulo}`}
          >
            Quiénes somos
          </h2>
          <p className={`mt-1 text-sm italic ${Neutros.texto}`}>
            ServiciosNerea es una plataforma creada para conectar personas
            que necesitan reparaciones y servicios del hogar (albañilería,
            electricidad, gas, y otros rubros) con especialistas profesionales matriculados
           que brindan sus servicios, garantizando confianza y calidad.
          </p>
        </section>

      </div>
    </LayoutPublico>
  );
}
