# ServiciosNerea

Aplicación web que conecta a personas que necesitan una reparación con profesionales de plomería, electricidad, albañilería, pintura, gas u otros servicios. Permite buscar especialistas, consultar sus servicios y matrícula (en caso que tengan), y solicitar turnos disponibles para coordinar una visita de trabajo.

Proyecto académico del IFTS N.º 16 para la materia Proyecto de Práctica Profesional II (PP2), ciclo lectivo 2026.

## Problema que resuelve

Encontrar un profesional confiable y coordinar un turno puede requerir muchas consultas por distintos medios. ServiciosNerea reúne a clientes con profesionales de distintos perfiles y especialidades, con la información de matrícula (trabajos garantizados) y su disponibilidad, todo en un mismo lugar.

## Funcionalidades

- Búsqueda y consulta paginada de profesionales, con filtros por nombre, rubro y código postal.
- Registro e inicio de sesión para clientes y profesionales.
- Perfiles profesionales con especialidades y estado de matrícula.
- Publicación y administración de turnos por parte de cada profesional.
- Solicitud y gestión de reservas según el rol del usuario.
- Panel de administración para gestionar usuarios, categorías, matrículas y reservas.
- Interfaz web adaptable a dispositivos móviles.

## Roles

- **Cliente:** busca profesionales y solicita o gestiona sus reservas.
- **Profesional:** administra sus especialidades, matrícula, disponibilidad y reservas.
- **Administrador:** gestiona usuarios, categorías, matrículas y reservas.

## Alcance

El MVP se enfoca en la búsqueda de profesionales y la coordinación de turnos. No incluye pagos, chat en tiempo real, asignación automática, videollamadas ni aplicación móvil nativa.

Para las pruebas y demostraciones se deben usar únicamente cuentas y datos ficticios; no cargar datos reales de clientes ni profesionales.

## Tecnologías

- React 19 y TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- Supabase Auth y PostgreSQL
- API serverless de Vercel

## Arquitectura y seguridad

El frontend consume Supabase para las consultas públicas y usa endpoints del servidor para operaciones que requieren sesión. En desarrollo, Vite también sirve localmente los endpoints de `api/`.

| Requisito | Cómo se aborda |
| --- | --- |
| Acceso según el rol | El router separa las pantallas de clientes, profesionales y administradores. Los endpoints validan la sesión y los permisos necesarios. |
| Acceso a datos propios | Las políticas RLS de Supabase limitan el acceso a reservas y disponibilidades según el usuario autenticado. |
| Credenciales de sesión | El servidor guarda los tokens de sesión en cookies `HttpOnly`; JavaScript no puede leerlos. |
| Contraseñas | El inicio de sesión y el almacenamiento de credenciales se delegan a Supabase Auth. |
| Integridad de los turnos | La base de datos valida las operaciones y evita reservas activas duplicadas para el mismo turno. |
| Claves del proyecto | La clave publicable de Supabase se configura mediante variables de entorno. No se debe usar ni publicar una clave `service_role`. |

El control de rutas en el navegador mejora la experiencia, pero no reemplaza la autorización del servidor ni las políticas de la base de datos.

## Requisitos para ejecutar

- Node.js y npm.
- Un proyecto de Supabase configurado con el esquema de base de datos de ServiciosNerea.

## Configuración local

1. Clonar el repositorio e instalar las dependencias:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ServiciosNerea
   npm ci
   ```

2. Crear un archivo `.env` en la raíz con las credenciales públicas del proyecto Supabase:

   ```env
   VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
   ```

   También se acepta `VITE_SUPABASE_ANON_KEY` como nombre alternativo para la clave publicable. No guardar claves secretas ni subir el archivo `.env` al repositorio.

3. Configurar la base de datos de Supabase. Los archivos de `supabase/` contienen SQL complementario para el registro y la agenda. Deben aplicarse sobre el esquema base esperado por la aplicación; no constituyen por sí solos una instalación completa de la base de datos.

4. Iniciar la aplicación:

   ```bash
   npm run dev
   ```

   Vite sirve la aplicación y las funciones de `api/` para el entorno local.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el entorno local de desarrollo. |
| `npm run build` | Ejecuta el chequeo de TypeScript y genera la versión de producción. |
| `npm run preview` | Sirve localmente la compilación generada. |

## Despliegue

El proyecto está preparado para Vercel: `api/` contiene los endpoints del servidor y `vercel.json` dirige las rutas de la aplicación al frontend.

Al configurar el proyecto en Vercel, definir las variables de entorno de Supabase para el build y las funciones del servidor:

```env
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
SUPABASE_URL=https://<PROJECT_REF>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

La clave publicable está destinada al cliente web y no reemplaza las políticas RLS. Nunca configurar una clave `service_role` en variables `VITE_*`.

## Uso de asistentes de IA

Se utilizaron asistentes de IA como apoyo para tareas de desarrollo y documentación.

- Desarrollado por Grupo 2 - PP2 - IFTS16 (Nov. 2026) -