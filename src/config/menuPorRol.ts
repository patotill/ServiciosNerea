import { ROUTES } from "../router/routes";
import type { Rol } from "../types/tables";

export type ItemMenu = {
  etiqueta: string;
  to: string;
  end?: boolean;
};

/** Botones del menú lateral por rol; cada pantalla nueva se agrega acá. */
export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  cliente: [{ etiqueta: "Inicio", to: ROUTES.HOME }],
  profesional: [
    { etiqueta: "Inicio", to: ROUTES.HOME },
    { etiqueta: "Mi agenda", to: ROUTES.AGENDA_PROFESIONAL },
  ],
  admin: [
    { etiqueta: "Inicio", to: ROUTES.HOME },
    { etiqueta: "Categorías de servicio", to: ROUTES.ADMIN_CATEGORIAS },
    { etiqueta: "Verificación de matrículas", to: ROUTES.ADMIN_MATRICULAS },
    { etiqueta: "Gestión de reservas", to: ROUTES.ADMIN_RESERVAS },
  ],
};

/** Navegación pública; también se ofrece a quien ya tiene sesión. */
export const NAVEGACION_PUBLICA: ItemMenu[] = [
  { etiqueta: "Inicio", to: ROUTES.HOME },
  { etiqueta: "Profesionales", to: ROUTES.PUBLICO },
];

export const MENU_PUBLICO: ItemMenu[] = [
  ...NAVEGACION_PUBLICA,
  { etiqueta: "Iniciar sesión", to: ROUTES.LOGIN },
  { etiqueta: "Registrarme como cliente", to: ROUTES.REGISTRO_CLIENTE },
  { etiqueta: "Registrarme como profesional", to: ROUTES.REGISTRO_PROFESIONAL },
];
