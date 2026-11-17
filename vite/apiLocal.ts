import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite";

type Handler = (req: unknown, res: unknown) => unknown;

// Solo rutas simples; los segmentos con "_" (api/_lib) no son endpoints.
const RUTA_API = /^\/api\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)$/i;

async function leerBody(req: IncomingMessage): Promise<unknown> {
  const partes: Buffer[] = [];
  for await (const parte of req) partes.push(parte as Buffer);

  const texto = Buffer.concat(partes).toString("utf8");
  if (!texto) return undefined;

  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}

/**
 * Sirve las funciones de `api/` (formato Vercel) dentro de `npm run dev`,
 * para no depender de `vercel dev`. Solo se usa en desarrollo.
 */
export default function apiLocal(): Plugin {
  return {
    name: "api-local",
    apply: "serve",
    configureServer(server) {
      // Las funciones leen SUPABASE_*; en local reutilizan las VITE_* del .env.
      const env = loadEnv(server.config.mode, server.config.root, "");
      process.env.SUPABASE_URL ??= env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
      process.env.SUPABASE_PUBLISHABLE_KEY ??=
        env.SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;

      server.middlewares.use(async (req, res, siguiente) => {
        const ruta = RUTA_API.exec((req.url ?? "").split("?")[0]);
        if (!ruta) return siguiente();

        const respuesta = res as ServerResponse & {
          status: (codigo: number) => typeof respuesta;
          json: (cuerpo: unknown) => void;
        };
        respuesta.status = (codigo) => {
          respuesta.statusCode = codigo;
          return respuesta;
        };
        respuesta.json = (cuerpo) => {
          respuesta.setHeader("Content-Type", "application/json");
          respuesta.end(JSON.stringify(cuerpo));
        };

        try {
          const modulo = (await server.ssrLoadModule(
            `/api/${ruta[1]}.ts`,
          )) as { default?: Handler };

          if (!modulo.default) return siguiente();

          (req as IncomingMessage & { body?: unknown }).body =
            await leerBody(req);
          await modulo.default(req, respuesta);
        } catch (error) {
          if (!respuesta.headersSent) {
            const noExiste =
              error instanceof Error && error.message.includes("Failed to load url");
            if (noExiste) return siguiente();

            console.error(error);
            respuesta.status(500).json({ error: "Error en la función local." });
          }
        }
      });
    },
  };
}
