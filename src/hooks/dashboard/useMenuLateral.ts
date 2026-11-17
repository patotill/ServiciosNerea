import { useEffect, useRef, useState } from "react";

/** Estado del drawer: bloquea el scroll, atrapa el foco y cierra con Escape. */
export default function useMenuLateral() {
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  function abrir() {
    setAbierto(true);
  }

  function cerrar() {
    setAbierto(false);
    botonMenu.current?.focus();
  }

  useEffect(() => {
    if (!abierto) return;

    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();

    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAbierto(false);
        botonMenu.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menu.current) return;

      // El foco no sale del drawer mientras está abierto.
      const enfocables = menu.current.querySelectorAll<HTMLElement>(
        "a[href], button:not(:disabled)"
      );
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
    document.addEventListener("keydown", alTeclear);

    return () => {
      document.body.style.overflow = scrollPrevio;
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return { abierto, abrir, cerrar, botonMenu, botonCerrar, menu };
}
