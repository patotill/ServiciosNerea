import type { VercelRequest, VercelResponse } from "@vercel/node";

export const COOKIE_ACCESS = "sn_access";
export const COOKIE_REFRESH = "sn_refresh";

const PRODUCCION = process.env.NODE_ENV === "production";

function opcionesCookie(maxAge: number): string {
  return [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    ...(PRODUCCION ? ["Secure"] : []),
    `Max-Age=${maxAge}`,
  ].join("; ");
}

export function establecerCookiesSesion(
  res: VercelResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  res.setHeader("Set-Cookie", [
    `${COOKIE_ACCESS}=${encodeURIComponent(accessToken)}; ${opcionesCookie(expiresIn)}`,
    `${COOKIE_REFRESH}=${encodeURIComponent(refreshToken)}; ${opcionesCookie(60 * 60 * 24 * 30)}`,
  ]);
}

export function eliminarCookiesSesion(res: VercelResponse): void {
  res.setHeader("Set-Cookie", [
    `${COOKIE_ACCESS}=; ${opcionesCookie(0)}`,
    `${COOKIE_REFRESH}=; ${opcionesCookie(0)}`,
  ]);
}

export function obtenerCookie(
  req: VercelRequest,
  nombre: string
): string | null {
  const encabezado = req.headers.cookie;

  if (!encabezado) return null;

  for (const parte of encabezado.split(";")) {
    const indice = parte.indexOf("=");

    if (indice === -1) continue;

    const clave = parte.slice(0, indice).trim();

    if (clave === nombre) {
      try {
        return decodeURIComponent(
          parte.slice(indice + 1).trim()
        );
      } catch {
        return null;
      }
    }
  }

  return null;
}