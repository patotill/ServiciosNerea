import type { Rol } from "./tables";

type SignUpBase = {
  nombre: string;
  email: string;
  telefono: string;
  codigo_postal: string;
  password: string;
};

export type SignUpCliente = SignUpBase & { rol: Extract<Rol, "cliente"> };

export type SignUpProfesional = SignUpBase & {
  rol: Extract<Rol, "profesional">;
  servicios: number[];
  matricula?: string;
};

export type SignUpData = SignUpCliente | SignUpProfesional;
