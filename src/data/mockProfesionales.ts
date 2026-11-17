// Datos de ejemplo mientras la vista no traiga descripción ni localidad; borrar cuando haya datos reales.

const DESCRIPCION_POR_RUBRO: Record<string, string> = {
  plomeria: "Instalación y reparación de cañerías, canillas y desagües.",
  electricidad: "Instalaciones eléctricas, tableros y reparación de fallas.",
  albanileria: "Obras chicas, revoques, pisos y arreglos de mampostería.",
  pintura: "Pintura de interiores y exteriores, con preparación de superficies.",
  gas: "Instalación y revisión de artefactos y conexiones de gas.",
};

const DESCRIPCION_GENERICA = "Todavía no cargó una descripción de su trabajo.";

const LOCALIDAD_POR_CP: Record<string, string> = {
  "1425": "Palermo, CABA",
  "1414": "Villa Crespo, CABA",
  "1900": "La Plata",
  "2000": "Rosario",
  "5000": "Córdoba",
};

const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function descripcionMock(servicios: string[]): string {
  const rubro = servicios.map(normalizar).find((s) => s in DESCRIPCION_POR_RUBRO);
  return rubro ? DESCRIPCION_POR_RUBRO[rubro] : DESCRIPCION_GENERICA;
}

export function localidadMock(codigoPostal: string | null): string {
  if (!codigoPostal) return "Zona sin informar";
  return LOCALIDAD_POR_CP[codigoPostal] ?? `CP ${codigoPostal}`;
}
