
export const ROUTES = {
  HOME: "/",
  PUBLICO: "/public",
  LOGIN: "/login",
  REGISTRO_CLIENTE: "/registro/cliente",
  REGISTRO_PROFESIONAL: "/registro/profesional",
  CLIENTE: "/cliente",
  PROFESIONAL: "/profesional",
  AGENDA_PROFESIONAL: "/profesional/agenda",
  RESERVAR: "/reservar",
  ADMIN: "/admin",
  ADMIN_CATEGORIAS: "/admin/categorias",
} as const;

export const ROLE_HOME = {
  cliente: ROUTES.CLIENTE,
  profesional: ROUTES.PROFESIONAL,
  admin: ROUTES.ADMIN,
} as const;
