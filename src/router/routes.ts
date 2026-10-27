
export const ROUTES = {
  LOGIN: "/",
  REGISTRO_CLIENTE: "/registro/cliente",
  REGISTRO_PROFESIONAL: "/registro/profesional",
  CLIENTE: "/cliente",
  PROFESIONAL: "/profesional",
  ADMIN: "/admin",
} as const;

export const ROLE_ROUTES = {
  cliente: ROUTES.CLIENTE,
  profesional: ROUTES.PROFESIONAL,
  admin: ROUTES.ADMIN,
} as const;
