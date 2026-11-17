import { ROLE_HOME, ROUTES } from "../router/routes";
import type { Rol } from "../types/tables";

export type ItemMenu = {
  etiqueta: string;
  to: string;
};

/** Botones del menú lateral por rol; cada pantalla nueva se agrega acá. */
export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  cliente: [{ etiqueta: "Inicio", to: ROLE_HOME.cliente }],
  profesional: [{ etiqueta: "Inicio", to: ROLE_HOME.profesional }],
  admin: [],
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
