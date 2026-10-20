
export type SignUpData = {
  nombre: string;
  email: string;
  telefono: string;
  codigo_postal: string;
  password: string;
  rol: "cliente" | "profesional";
};
