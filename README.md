# Servicios y Reparaciones NEREA 🛠️

Plataforma web integral diseñada para la gestión y conexión de servicios técnicos, profesionales y clientes.
El sistema cuenta con autenticación unificada y panel de control adaptativo según el rol del usuario (Cliente, Profesional y Administrador).
--- Proyecto a desarrollar. ---

---

## 🚀 Características Principales

- **Autenticación Unificada:** Formulario de inicio de sesión centralizado para todos los tipos de perfil.
- **Control de Acceso Basado en Roles (RBAC):**
  - **Cliente:** Solicitud de servicios, gestión de perfil y seguimiento.
  - **Profesional:** Registro específico, recepción de solicitudes y gestión de servicios ofrecidos.
  - **Administrador:** Panel de gestión general y control de la plataforma.
- **Seguridad en Base de Datos:**
  - Control de actualización de roles resguardado mediante funciones y triggers en PostgreSQL (`proteger_rol_usuario`).
  - Integración nativa con Supabase Auth y base de datos relacional.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & DB:** [Supabase](https://supabase.com/) (Authentication & PostgreSQL)
- **Navegación:** [React Router](https://reactrouter.com/)

---

## 📁 Estructura del Proyecto

```text
src/
├── components/       # Componentes reutilizables (Botones, Inputs, Cards, etc.)
├── router/           # Configuración de rutas de la aplicación (ROUTES)
├── services/         # Integración con APIs y Supabase (authService, etc.)
└── views/            # Vistas principales (Login, Registros, Dashboards)
