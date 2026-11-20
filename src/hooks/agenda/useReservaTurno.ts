import { useCallback, useEffect, useRef, useState } from "react";
import {
  crearReservaPendiente,
  obtenerProfesionalParaReserva,
  obtenerTurnosDisponibles,
} from "../../services/agendaService";
import type {
  Disponibilidad,
  ProfesionalParaReserva,
} from "../../types/agenda";

export default function useReservaTurno(idProfesional: number | null) {
  const [profesional, setProfesional] =
    useState<ProfesionalParaReserva | null>(null);
  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const solicitud = useRef(0);

  const recargar = useCallback(async () => {
    const idSolicitud = ++solicitud.current;
    if (idProfesional === null) {
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const [perfil, disponibilidad] = await Promise.all([
        obtenerProfesionalParaReserva(idProfesional),
        obtenerTurnosDisponibles(idProfesional),
      ]);
      if (solicitud.current !== idSolicitud) return;
      setProfesional(perfil);
      setTurnos(disponibilidad);
    } catch (e: unknown) {
      if (solicitud.current !== idSolicitud) return;
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo cargar la información para reservar.",
      );
    } finally {
      if (solicitud.current === idSolicitud) setCargando(false);
    }
  }, [idProfesional]);

  useEffect(() => {
    void recargar();
    return () => {
      solicitud.current += 1;
    };
  }, [recargar]);

  const reservar = async (idServicio: number, idDisponibilidad: number) => {
    if (idProfesional === null) return false;
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await crearReservaPendiente({
        id_profesional: idProfesional,
        id_servicio: idServicio,
        id_disponibilidad: idDisponibilidad,
      });
      setTurnos((anteriores) =>
        anteriores.filter(
          (turno) => turno.id_disponibilidad !== idDisponibilidad,
        ),
      );
      setMensaje(
        "Solicitud enviada. El turno queda pendiente de confirmación del profesional.",
      );
      return true;
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "No se pudo enviar la solicitud.",
      );
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return {
    profesional,
    turnos,
    cargando,
    guardando,
    error,
    mensaje,
    recargar,
    reservar,
  };
}
