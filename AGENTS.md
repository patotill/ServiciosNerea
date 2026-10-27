# ServiciosNerea

App de intermediación entre clientes y profesionales (plomería, electricidad, albañilería, pintura, gas): búsqueda por servicio, perfil, disponibilidad y reservas por franja horaria. MVP universitario, prioridad en experiencia móvil.

La especificación completa está en `Especificacion_Formal_App_Servicios_y_Reparaciones 538e836514f9836089b2812392f5e09f.md` (ERS v1.1). Ante dudas de alcance, reglas o datos, ese documento manda. Los IDs `RF-xx`, `RN-xx`, `RNF-xx` y `CU-xx` se usan para referenciar requisitos en commits y PRs.

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS 4
- react-router-dom 7
- Supabase (`@supabase/supabase-js`) para auth y datos; axios disponible
- Scripts: `npm run dev`, `npm run build` (corre `tsc` primero)

## Estructura (`src/`)

| Carpeta | Contenido |
| --- | --- |
| `components/` | UI reutilizable y sin lógica de negocio (buttons, inputs, containers, text, list) |
| `views/` | Pantallas por funcionalidad (`login/`, `singUp/`) |
| `hooks/` | Lógica con estado/efectos, un hook por caso de uso (`useLogin`, `useServicios`) |
| `services/` | Acceso a Supabase/API (`authService.ts`) |
| `router/` | `AppRouter.tsx` y `routes.ts` (rutas como constantes en `ROUTES`) |
| `types/` | Tipos compartidos (`servicios`, `signup`, `tables`) |
| `utils/` | Utilidades sueltas (`supabase.ts`, `colors.ts`) |

## Dominio

- Roles: cliente, profesional, administrador. Login unificado con redirección según rol (`ROUTES.CLIENTE`, `ROUTES.PROFESIONAL`, `ROUTES.ADMIN`).
- Un profesional tiene una o varias especialidades y administra solo su propia disponibilidad y reservas (RN-01, RN-08).
- No puede haber dos reservas activas del mismo profesional en la misma franja (RN-03, RNF-03). La garantía real va en la base de datos, no solo en el front.
- Si el profesional no tiene matrícula cargada o verificada, la UI lo muestra antes de confirmar la reserva (RF-19, RN-05).
- Fuera del MVP: pagos, presupuesto automático, asignación automática, chat en tiempo real, videollamadas, facturación, GPS, calendarios externos, garantía. No implementarlos.

## Principios de código

### YAGNI (You Aren't Gonna Need It)

No construyas lo que hoy no hace falta.

- Implementá solo lo que pide el requisito actual del MVP; lo listado como "fuera de alcance" o "ampliaciones futuras" en la spec no se anticipa.
- Sin props, parámetros, opciones de configuración, capas de abstracción ni archivos "por si después".
- Sin código muerto ni comentado; si no se usa, se borra (`noUnusedLocals` ya lo marca).
- No agregues dependencias para algo que se resuelve con unas pocas líneas o con lo que ya está instalado.

### DRY (Don't Repeat Yourself)

Cada pieza de conocimiento vive en un solo lugar.

- Antes de crear un componente, hook o tipo, buscá si ya existe uno en `components/`, `hooks/` o `types/` y reutilizalo o extendelo.
- Rutas siempre desde `ROUTES`; colores desde `utils/colors.ts`; constantes de dominio (roles, estados de reserva, categorías) definidas una vez en `types/`.
- Extraé cuando la repetición es real (tercera aparición o misma regla de negocio duplicada), no por parecido superficial. Dos bloques que se parecen pero cambian por razones distintas no se unifican.
- DRY no justifica abstracciones prematuras: ante la duda entre duplicar un poco y abstraer mal, aplicá YAGNI.

### Colores (`src/utils/colors.ts`)

`AppColors` es la única fuente de colores de la UI. Cada color (`blue`, `red`, `green`, `gray`, `black`) define el mismo conjunto de claves: `bg`, `hover`, `border`, `linkHover`, `textHover`, `text`, `textLight`, `focusRing`.

- Los componentes reciben `color?: keyof typeof AppColors` y leen `AppColors[color]`; no escriben clases de color de marca (`bg-blue-600`, `text-red-500`, `focus:ring-*`) a mano.
- Las clases se escriben completas en `colors.ts` (`"bg-blue-600"`, nunca `` `bg-${c}-600` ``): Tailwind solo genera las clases que encuentra como texto literal.
- Si falta un color o un rol, extendé el archivo en vez de hardcodear en el componente:
  - Color nuevo: agregá una entrada con **todas** las claves existentes, con clases reales de Tailwind (verificá que la escala exista, p. ej. `black-600` no existe; para negro usá `gray-900`/`neutral-900`).
  - Rol nuevo (p. ej. `bgLight`, `borderFocus`): agregalo a **todos** los colores a la vez, para que `AppColors[color]` siga siendo intercambiable.
  - Solo extendé cuando hay un uso concreto hoy (YAGNI); no agregues variantes ni colores "por si acaso".
- Neutros estructurales sin significado de marca (bordes `border-gray-300`, texto de label `text-gray-700`, fondos `bg-white`) pueden quedar como clases Tailwind directas, pero si el mismo neutro se repite en tres o más componentes, pasalo a `colors.ts` (DRY).
- Estados con significado (error → `red`, éxito → `green`, acción principal → `blue`) se eligen por semántica, no por gusto: el mismo estado usa siempre el mismo color en toda la app.
- Cambiar un color de la app se hace editando `colors.ts`, no buscando y reemplazando en los componentes.

## Convenciones

- Español rioplatense en textos de UI y comentarios; identificadores de dominio ya existentes se respetan (`servicios`, `singUp`).
- Componentes funcionales con tipos explícitos en props; sin `any`.
- Comentarios solo cuando explican un porqué no obvio o una regla de negocio (RNF-06).
- Diseño mobile-first.
- Ramas `feature/*` hacia `develop`; `main` solo por merge desde `develop`.

## Agentes

| Agente | Uso |
| --- | --- |
| `frontend-expert` (`.claude/agents/`) | Implementar o revisar front: componentes, hooks, rutas, estado, integración con Supabase |
| `antislop-reviewer` (global) | Pasada de control tras cambios grandes de UI o copy |
| `graphify-explorer` (global) | Preguntas de arquitectura si existe `graphify-out/` |

Todos los agentes aplican YAGNI y DRY.
