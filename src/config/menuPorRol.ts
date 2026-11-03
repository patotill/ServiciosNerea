import { ROLE_HOME } from "../router/routes";
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
