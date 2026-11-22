import { useCallback, useEffect, useRef, useState } from "react";
import {
  crearTurnosDisponibles,
  eliminarTurnoDisponible,
  obtenerAgendaProfesional,
} from "../../services/agendaService";
import type { Disponibilidad, DuracionTurno } from "../../types/agenda";

export default function useAgendaProfesional() {
  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const solicitud = useRef(0);

  const recargar = useCallback(async () => {
    const idSolicitud = ++solicitud.current;
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerAgendaProfesional();
      if (solicitud.current === idSolicitud) setTurnos(datos);
    } catch (e: unknown) {
      if (solicitud.current === idSolicitud) {
        setError(
          e instanceof Error ? e.message : "No se pudo cargar tu agenda.",
        );
      }
    } finally {
      if (solicitud.current === idSolicitud) setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
    return () => {
      solicitud.current += 1;
    };
  }, [recargar]);

  const agregarTurnos = async (datos: {
    fecha: string;
    horaInicio: string;
    horaFin: string;
    duracion: DuracionTurno;
  }) => {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      const nuevosTurnos = await crearTurnosDisponibles(datos);
      setTurnos((anteriores) =>
        [...anteriores, ...nuevosTurnos].sort((a, b) =>
          `${a.fecha}${a.hora_inicio}`.localeCompare(`${b.fecha}${b.hora_inicio}`),
        ),
      );
      setMensaje(
        nuevosTurnos.length === 1
          ? "Se agregó 1 turno a tu agenda."
          : `Se agregaron ${nuevosTurnos.length} turnos a tu agenda.`,
      );
      return true;
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "No se pudieron guardar los turnos.",
      );
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const quitarTurno = async (idDisponibilidad: number) => {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await eliminarTurnoDisponible(idDisponibilidad);
      setTurnos((anteriores) =>
        anteriores.filter((turno) => turno.id_disponibilidad !== idDisponibilidad),
      );
      setMensaje("Se quitó el turno de tu agenda.");
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "No se pudo quitar el turno.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return {
    turnos,
    cargando,
    guardando,
    error,
    mensaje,
    recargar,
    agregarTurnos,
    quitarTurno,
  };
}
