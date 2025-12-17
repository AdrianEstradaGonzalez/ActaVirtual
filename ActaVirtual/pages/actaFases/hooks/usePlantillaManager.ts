import { useState } from 'react';
import { Jugador, StaffMember } from '../../../types/MockData';

export type Plantilla = {
  jugadores: Jugador[];
  liberos: Jugador[];
  staff: StaffMember[];
};

export function usePlantillaManager() {
  const [plantillaLocal, setPlantillaLocal] = useState<Plantilla>({
    jugadores: [],
    liberos: [],
    staff: [],
  });
  const [plantillaVisitante, setPlantillaVisitante] = useState<Plantilla>({
    jugadores: [],
    liberos: [],
    staff: [],
  });
  const [activeTab, setActiveTab] = useState<'local' | 'visitante'>('local');

  const getPlanillaActual = () => {
    return activeTab === 'local' ? plantillaLocal : plantillaVisitante;
  };

  const setPlanillaActual = (plantilla: Plantilla | ((prev: Plantilla) => Plantilla)) => {
    if (activeTab === 'local') {
      if (typeof plantilla === 'function') {
        setPlantillaLocal(prev => (plantilla as (prev: Plantilla) => Plantilla)(prev));
      } else {
        setPlantillaLocal(plantilla as Plantilla);
      }
    } else {
      if (typeof plantilla === 'function') {
        setPlantillaVisitante(prev => (plantilla as (prev: Plantilla) => Plantilla)(prev));
      } else {
        setPlantillaVisitante(plantilla as Plantilla);
      }
    }
  };

  const getTotalJugadoresEnActa = () => {
    const plantillaActual = getPlanillaActual();
    return plantillaActual.jugadores.length + plantillaActual.liberos.length;
  };

  const sortByName = <T extends { apellidos: string; nombre: string }>(list: T[]): T[] => {
    return [...list].sort((a, b) => {
      const apellidosComp = a.apellidos.localeCompare(b.apellidos, 'es', { sensitivity: 'base' });
      if (apellidosComp !== 0) return apellidosComp;
      return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });
  };

  const addJugador = (
    jugador: Jugador,
    tipoPersonal: 'jugador' | 'libero',
    esCapitan: boolean
  ): { success: boolean; error?: string } => {
    const plantillaActual = getPlanillaActual();
    const totalActual = getTotalJugadoresEnActa();

    if (totalActual >= 14) {
      return { success: false, error: 'No puedes añadir más de 14 jugadores en total' };
    }

    if (tipoPersonal === 'libero' && plantillaActual.liberos.length >= 2) {
      return { success: false, error: 'No puedes añadir más de 2 líberos' };
    }

    // validar dorsal obligatorio
    if (!jugador.dorsal || jugador.dorsal.toString().trim() === '') {
      return { success: false, error: 'El número de dorsal es obligatorio' };
    }

    // validar unicidad del dorsal (usa snapshot)
    const dorsalesExistentes = [
      ...plantillaActual.jugadores.map(j => j.dorsal),
      ...plantillaActual.liberos.map(l => l.dorsal),
    ].filter(Boolean);
    if (dorsalesExistentes.includes(jugador.dorsal)) {
      return { success: false, error: 'El número de dorsal ya está asignado' };
    }

    const nuevoJugador = { ...jugador, esCapitan };

    setPlanillaActual(prev => {
      // si se marca capitán, limpiar capitanes anteriores en prev
      const jugadoresPrev = prev.jugadores.map(j => ({ ...j, esCapitan: esCapitan ? false : j.esCapitan }));
      const liberosPrev = prev.liberos.map(l => ({ ...l, esCapitan: esCapitan ? false : l.esCapitan }));

      if (tipoPersonal === 'jugador') {
        return {
          ...prev,
          jugadores: [...jugadoresPrev, nuevoJugador],
          liberos: liberosPrev,
        };
      } else {
        return {
          ...prev,
          jugadores: jugadoresPrev,
          liberos: [...liberosPrev, nuevoJugador],
        };
      }
    });

    return { success: true };
  };

  const addJugadorNuevo = (
    formData: { nombre: string; apellidos: string; dni: string; dorsal: string },
    tipoPersonal: 'jugador' | 'libero'
  ): { success: boolean; error?: string } => {
    const plantillaActual = getPlanillaActual();
    const totalActual = getTotalJugadoresEnActa();

    if (totalActual >= 14) {
      return { success: false, error: 'No puedes añadir más de 14 jugadores en total' };
    }

    if (tipoPersonal === 'libero' && plantillaActual.liberos.length >= 2) {
      return { success: false, error: 'No puedes añadir más de 2 líberos' };
    }

    // validar dorsal obligatorio
    if (!formData.dorsal || formData.dorsal.toString().trim() === '') {
      return { success: false, error: 'El número de dorsal es obligatorio' };
    }

    // validar unicidad del dorsal
    const dorsalesExistentes = [
      ...plantillaActual.jugadores.map(j => j.dorsal),
      ...plantillaActual.liberos.map(l => l.dorsal),
    ].filter(Boolean);
    if (dorsalesExistentes.includes(formData.dorsal)) {
      return { success: false, error: 'El número de dorsal ya está asignado' };
    }

    const newJugador: Jugador = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      dorsal: formData.dorsal,
      esCapitan: false,
    };

    setPlanillaActual(prev => {
      if (tipoPersonal === 'jugador') {
        return { ...prev, jugadores: [...prev.jugadores, newJugador] };
      }
      return { ...prev, liberos: [...prev.liberos, newJugador] };
    });

    return { success: true };
  };

  const addStaff = (
    formData: { id?: string; nombre: string; apellidos: string; dni: string },
    rol: 'entrenador' | 'delegado' | 'entrenadorAsistente'
  ): { success: boolean; error?: string } => {
    const plantillaActual = getPlanillaActual();
    
    // Validar límites específicos por rol
    if (rol === 'entrenador') {
      const yaExisteEntrenador = plantillaActual.staff.some(s => s.rol === 'entrenador');
      if (yaExisteEntrenador) {
        return { success: false, error: 'Ya existe un Entrenador (máximo 1)' };
      }
    } else if (rol === 'delegado') {
      const yaExisteDelegado = plantillaActual.staff.some(s => s.rol === 'delegado');
      if (yaExisteDelegado) {
        return { success: false, error: 'Ya existe un Delegado (máximo 1)' };
      }
    } else if (rol === 'entrenadorAsistente') {
      const countAsistentes = plantillaActual.staff.filter(s => s.rol === 'entrenadorAsistente').length;
      if (countAsistentes >= 4) {
        return { success: false, error: 'Ya existen 4 Entrenadores Asistentes (máximo 4)' };
      }
    }

    // evitar duplicados por id
    if (formData.id && plantillaActual.staff.some(s => s.id === formData.id)) {
      return { success: false, error: 'El técnico ya está añadido' };
    }

    const newStaff: StaffMember = {
      id: formData.id ?? Date.now().toString(),
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      rol: rol,
    };

    setPlanillaActual(prev => ({
      ...prev,
      staff: [...prev.staff, newStaff],
    }));

    return { success: true };
  };

  const toggleCapitan = (id: string, esJugador: boolean) => {
    setPlanillaActual(prev => {
      if (esJugador) {
        const jugadores = prev.jugadores.map(j => ({ ...j, esCapitan: j.id === id ? !j.esCapitan : false }));
        const liberos = prev.liberos.map(l => ({ ...l, esCapitan: false }));
        return { ...prev, jugadores, liberos };
      }
      const liberos = prev.liberos.map(l => ({ ...l, esCapitan: l.id === id ? !l.esCapitan : false }));
      const jugadores = prev.jugadores.map(j => ({ ...j, esCapitan: false }));
      return { ...prev, jugadores, liberos };
    });
  };

  const removePersonal = (
    tipo: 'jugador' | 'libero' | 'staff',
    id: string
  ) => {
    const plantillaActual = getPlanillaActual();

    if (tipo === 'jugador') {
      setPlanillaActual({
        ...plantillaActual,
        jugadores: plantillaActual.jugadores.filter(p => p.id !== id),
      });
    } else if (tipo === 'libero') {
      setPlanillaActual({
        ...plantillaActual,
        liberos: plantillaActual.liberos.filter(p => p.id !== id),
      });
    } else if (tipo === 'staff') {
      setPlanillaActual({
        ...plantillaActual,
        staff: plantillaActual.staff.filter(s => s.id !== id),
      });
    }
  };

  const canContinue = () => {
    const localOk = plantillaLocal.jugadores.length > 0;
    const visitanteOk = plantillaVisitante.jugadores.length > 0;
    return localOk && visitanteOk;
  };

  return {
    plantillaLocal,
    plantillaVisitante,
    activeTab,
    setActiveTab,
    getPlanillaActual,
    setPlanillaActual,
    getTotalJugadoresEnActa,
    sortByName,
    addJugador,
    addJugadorNuevo,
    addStaff,
    toggleCapitan,
    removePersonal,
    canContinue,
  };
}
