import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import { createPartidoStyles } from "./styles/PartidoStyles";
import { useCommunity } from "../../context/CommunityContext";
import VectorIcon from "../../components/VectorIcon";
import CustomAlert from "../../components/CustomAlert";
import { Jugador, Categoria, StaffMember } from "../../types/MockData";

type MatchDataExport = {
  setsGanadosA: number;
  setsGanadosB: number;
  marcadorSets: { puntosA: number; puntosB: number }[];
  amonestaciones: Amonestacion[];
  sustituciones: Sustitucion[];
  tiemposUsadosA: { [set: number]: number };
  tiemposUsadosB: { [set: number]: number };
  sustitucionesUsadasA: { [set: number]: number };
  sustitucionesUsadasB: { [set: number]: number };
  totalSets: number;
};

type Props = {
  categoria: Categoria;
  equipoSacaInicial?: "A" | "B";
  jugadoresEquipoA?: Jugador[];
  jugadoresEquipoB?: Jugador[];
  staffEquipoA?: StaffMember[];
  staffEquipoB?: StaffMember[];
  nombreEquipoA?: string;
  nombreEquipoB?: string;
  codigoEquipoA?: string;
  codigoEquipoB?: string;
  capitanEquipoA?: string; // ID del jugador capitán
  capitanEquipoB?: string;
  onEscanear?: (eq: "A" | "B") => void;
  observaciones?: string;
  onObservacionesChange?: (text: string) => void;
  onMatchDataChange?: (data: MatchDataExport) => void;
  onMatchFinished?: () => void;
};

type Posicion = "I" | "II" | "III" | "IV" | "V" | "VI";

type Alineacion = {
  [key in Posicion]?: string; // dorsal del jugador
};

type AmonestacionTipo = "amarilla" | "roja" | "expulsion" | "descalificacion" | "demora-amarilla" | "demora-roja";

type Amonestacion = {
  equipo: "A" | "B";
  jugador: string; // dorsal
  tipo: AmonestacionTipo;
  set: number;
};

type Sustitucion = {
  equipo: "A" | "B";
  sale: string; // dorsal
  entra: string; // dorsal
  set: number;
};

type ModalState = {
  visible: boolean;
  tipo?: "menu-accion" | "sustitucion" | "amonestacion" | "capitan" | "confirmacion-set" | "demora" | "seleccionar-capitan" | "lesion";
  equipo?: "A" | "B";
  posicion?: Posicion;
  jugadorDorsal?: string;
};

type CustomAlertState = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
};

type AccionHistorial = {
  tipo: "punto" | "rotacion" | "timeout" | "sustitucion" | "amonestacion";
  equipo?: "A" | "B";
  data: any;
  estadoAnterior: {
    puntosA: number;
    puntosB: number;
    setActual: number;
    setsGanadosA: number;
    setsGanadosB: number;
    alineacionesA: { [set: number]: Alineacion };
    alineacionesB: { [set: number]: Alineacion };
    equipoSaca: "A" | "B";
    tiemposUsadosA: { [set: number]: number };
    tiemposUsadosB: { [set: number]: number };
    sustitucionesUsadasA: { [set: number]: number };
    sustitucionesUsadasB: { [set: number]: number };
    amonestaciones: Amonestacion[];
    sustituciones: Sustitucion[];
  };
};

const icons = {
  qr: require("../../assets/icons/qr.png"),
  swap: require("../../assets/icons/swap.png"),
};

export default function PartidoView({
  categoria,
  equipoSacaInicial = "A",
  jugadoresEquipoA = [],
  jugadoresEquipoB = [],
  staffEquipoA = [],
  staffEquipoB = [],
  nombreEquipoA = "Equipo A",
  nombreEquipoB = "Equipo B",
  codigoEquipoA = "AAA",
  codigoEquipoB = "BBB",
  capitanEquipoA,
  capitanEquipoB,
  onEscanear,
  observaciones = "",
  onObservacionesChange,
  onMatchDataChange,
  onMatchFinished,
}: Props) {
  const { theme, assets, communityId } = useCommunity();
  
  if (!theme) return null;
  
  const styles = createPartidoStyles(theme);

  // Determinar número de sets según categoría
  const categoriasMenores: Categoria[] = ['miniBenjamin', 'Benjamin', 'Alevin'];
  const totalSets = categoriasMenores.includes(categoria) ? 3 : 5;

  // Estado del partido
  const [setActual, setSetActual] = useState(1);
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [setsGanadosA, setSetsGanadosA] = useState(0);
  const [setsGanadosB, setSetsGanadosB] = useState(0);
  const [equipoSaca, setEquipoSaca] = useState<"A" | "B">(equipoSacaInicial);
  const [cambioCampoSet5, setCambioCampoSet5] = useState(false);
  const [swapLados, setSwapLados] = useState(false);

  // Alineaciones por set (con datos de ejemplo para testing)
  const [alineacionesA, setAlineacionesA] = useState<{ [set: number]: Alineacion }>({
    1: { I: "5", II: "12", III: "8", IV: "3", V: "7", VI: "15" }
  });
  const [alineacionesB, setAlineacionesB] = useState<{ [set: number]: Alineacion }>({
    1: { I: "9", II: "11", III: "6", IV: "2", V: "14", VI: "10" }
  });

  // Control de capitanes en pista (pueden cambiar durante el partido)
  const [capitanPistaA, setCapitanPistaA] = useState<string | undefined>(capitanEquipoA);
  const [capitanPistaB, setCapitanPistaB] = useState<string | undefined>(capitanEquipoB);

  // Controles
  const [tiemposUsadosA, setTiemposUsadosA] = useState<{ [set: number]: number }>({});
  const [tiemposUsadosB, setTiemposUsadosB] = useState<{ [set: number]: number }>({});
  const [sustitucionesUsadasA, setSustitucionesUsadasA] = useState<{ [set: number]: number }>({});
  const [sustitucionesUsadasB, setSustitucionesUsadasB] = useState<{ [set: number]: number }>({});

  // Historial
  const [amonestaciones, setAmonestaciones] = useState<Amonestacion[]>([]);
  const [sustituciones, setSustituciones] = useState<Sustitucion[]>([]);

  // Marcador de sets finalizados
  const [marcadorSets, setMarcadorSets] = useState<{ puntosA: number; puntosB: number }[]>([]);

  // Modal
  const [modal, setModal] = useState<ModalState>({ visible: false });

  // Scanner QR
  const [scannerVisible, setScannerVisible] = useState(false);
  const [equipoEscanear, setEquipoEscanear] = useState<"A" | "B">("A");

  // Custom Alert
  const [customAlert, setCustomAlert] = useState<CustomAlertState>({ visible: false });

  // Timer de tiempo muerto
  const [timeoutActivo, setTimeoutActivo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(30);
  const [equipoTimeout, setEquipoTimeout] = useState<"A" | "B" | null>(null);

  // Historial para deshacer
  const [historial, setHistorial] = useState<AccionHistorial[]>([]);

  // Estado de rotación animada
  const [rotando, setRotando] = useState(false);
  const [direccionRotacion, setDireccionRotacion] = useState<'horario' | 'antihorario'>('horario');

  // Valores animados para cada posición
  const animacionesA = useRef({
    I: new Animated.Value(1),
    II: new Animated.Value(1),
    III: new Animated.Value(1),
    IV: new Animated.Value(1),
    V: new Animated.Value(1),
    VI: new Animated.Value(1),
  }).current;

  const animacionesB = useRef({
    I: new Animated.Value(1),
    II: new Animated.Value(1),
    III: new Animated.Value(1),
    IV: new Animated.Value(1),
    V: new Animated.Value(1),
    VI: new Animated.Value(1),
  }).current;

  // ===== EFECTO PARA TIMER DE TIMEOUT =====
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (timeoutActivo && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes(prev => prev - 1);
      }, 1000);
    } else if (timeoutActivo && segundosRestantes === 0) {
      finalizarTimeout();
    }
    return () => clearInterval(intervalo);
  }, [timeoutActivo, segundosRestantes]);

  // ===== NOTIFICAR DATOS DEL PARTIDO AL PADRE =====
  useEffect(() => {
    if (onMatchDataChange) {
      onMatchDataChange({
        setsGanadosA,
        setsGanadosB,
        marcadorSets,
        amonestaciones,
        sustituciones,
        tiemposUsadosA,
        tiemposUsadosB,
        sustitucionesUsadasA,
        sustitucionesUsadasB,
        totalSets,
      });
    }
  }, [setsGanadosA, setsGanadosB, marcadorSets, amonestaciones, sustituciones, tiemposUsadosA, tiemposUsadosB, sustitucionesUsadasA, sustitucionesUsadasB]);

  // ===== GUARDAR ESTADO ACTUAL =====
  const guardarEstadoActual = (): AccionHistorial["estadoAnterior"] => ({
    puntosA,
    puntosB,
    setActual,
    setsGanadosA,
    setsGanadosB,
    alineacionesA: { ...alineacionesA },
    alineacionesB: { ...alineacionesB },
    equipoSaca,
    tiemposUsadosA: { ...tiemposUsadosA },
    tiemposUsadosB: { ...tiemposUsadosB },
    sustitucionesUsadasA: { ...sustitucionesUsadasA },
    sustitucionesUsadasB: { ...sustitucionesUsadasB },
    amonestaciones: [...amonestaciones],
    sustituciones: [...sustituciones],
  });

  // ===== DESHACER ÚNICA ACCIÓN =====
  const deshacerAccion = () => {
    if (historial.length === 0) return;

    const ultimaAccion = historial[historial.length - 1];
    const estado = ultimaAccion.estadoAnterior;

    // Si la última acción fue un punto con rotación, animar rotación inversa
    if (ultimaAccion.tipo === "punto" && ultimaAccion.data.rotacion && ultimaAccion.equipo) {
      setRotando(true);
      setDireccionRotacion('antihorario');
      
      // Primero restaurar el estado
      setPuntosA(estado.puntosA);
      setPuntosB(estado.puntosB);
      setSetActual(estado.setActual);
      setSetsGanadosA(estado.setsGanadosA);
      setSetsGanadosB(estado.setsGanadosB);
      setEquipoSaca(estado.equipoSaca);
      setTiemposUsadosA(estado.tiemposUsadosA);
      setTiemposUsadosB(estado.tiemposUsadosB);
      setSustitucionesUsadasA(estado.sustitucionesUsadasA);
      setSustitucionesUsadasB(estado.sustitucionesUsadasB);
      setAmonestaciones(estado.amonestaciones);
      setSustituciones(estado.sustituciones);
      
      // Animar la rotación inversa
      const equipo = ultimaAccion.equipo;
      const animaciones = equipo === "A" ? animacionesA : animacionesB;
      const posiciones: Posicion[] = ["I", "II", "III", "IV", "V", "VI"];
      
      // Fade out
      Animated.parallel(
        posiciones.map(pos => 
          Animated.timing(animaciones[pos], {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          })
        )
      ).start(() => {
        // Restaurar alineaciones en medio de la animación
        setAlineacionesA(estado.alineacionesA);
        setAlineacionesB(estado.alineacionesB);
        
        // Fade in
        Animated.parallel(
          posiciones.map(pos => 
            Animated.timing(animaciones[pos], {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            })
          )
        ).start(() => {
          setRotando(false);
        });
      });
      
      setHistorial(historial.slice(0, -1));
    } else {
      // Sin rotación, deshacer normalmente
      setPuntosA(estado.puntosA);
      setPuntosB(estado.puntosB);
      setSetActual(estado.setActual);
      setSetsGanadosA(estado.setsGanadosA);
      setSetsGanadosB(estado.setsGanadosB);
      setAlineacionesA(estado.alineacionesA);
      setAlineacionesB(estado.alineacionesB);
      setEquipoSaca(estado.equipoSaca);
      setTiemposUsadosA(estado.tiemposUsadosA);
      setTiemposUsadosB(estado.tiemposUsadosB);
      setSustitucionesUsadasA(estado.sustitucionesUsadasA);
      setSustitucionesUsadasB(estado.sustitucionesUsadasB);
      setAmonestaciones(estado.amonestaciones);
      setSustituciones(estado.sustituciones);

      setHistorial(historial.slice(0, -1));
    }
  };

  // Determinar equipos en cada lado (se invierten cada set)
  let equipoIzq: "A" | "B" = setActual % 2 === 1 ? "A" : "B";
  let equipoDer: "A" | "B" = setActual % 2 === 1 ? "B" : "A";

  // En set decisivo (5 o 3), considerar swap manual y cambio automático en punto 8
  if ((totalSets === 5 && setActual === 5) || (totalSets === 3 && setActual === 3)) {
    // Aplicar swap manual primero (sorteo inicial)
    if (swapLados) {
      [equipoIzq, equipoDer] = [equipoDer, equipoIzq];
    }
    // Cambio automático al llegar al punto 8
    if (cambioCampoSet5) {
      [equipoIzq, equipoDer] = [equipoDer, equipoIzq];
    }
  }

  // Obtener alineación actual
  const alineacionActualA = alineacionesA[setActual] || {};
  const alineacionActualB = alineacionesB[setActual] || {};

  // Jugadores en banquillo
  const jugadoresEnCampoA = Object.values(alineacionActualA);
  const jugadoresBanquilloA = jugadoresEquipoA.filter(j => !jugadoresEnCampoA.includes(j.dorsal || ""));

  const jugadoresEnCampoB = Object.values(alineacionActualB);
  const jugadoresBanquilloB = jugadoresEquipoB.filter(j => !jugadoresEnCampoB.includes(j.dorsal || ""));

  // ===== LÓGICA DE ROTACIÓN =====
  const rotar = (equipo: "A" | "B") => {
    const alineacion = equipo === "A" ? { ...alineacionActualA } : { ...alineacionActualB };
    
    // Rotación en sentido horario: I → VI → V → IV → III → II → I
    const temp = alineacion.I;
    alineacion.I = alineacion.II;
    alineacion.II = alineacion.III;
    alineacion.III = alineacion.IV;
    alineacion.IV = alineacion.V;
    alineacion.V = alineacion.VI;
    alineacion.VI = temp;

    if (equipo === "A") {
      setAlineacionesA({ ...alineacionesA, [setActual]: alineacion });
    } else {
      setAlineacionesB({ ...alineacionesB, [setActual]: alineacion });
    }
  };

  // ===== ANIMACIÓN DE ROTACIÓN =====
  const animarRotacion = (equipo: "A" | "B", direccion: 'horario' | 'antihorario' = 'horario') => {
    const animaciones = equipo === "A" ? animacionesA : animacionesB;
    const posiciones: Posicion[] = ["I", "II", "III", "IV", "V", "VI"];
    
    // Fade out con desplazamiento
    Animated.parallel(
      posiciones.map(pos => 
        Animated.timing(animaciones[pos], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      // Rotar en medio de la animación
      rotar(equipo);
      
      // Fade in
      Animated.parallel(
        posiciones.map(pos => 
          Animated.timing(animaciones[pos], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        )
      ).start();
    });
  };

  // ===== ANOTAR PUNTO =====
  const anotarPunto = (equipo: "A" | "B") => {
    // Verificar si el set ya está terminado (no permitir más puntos)
    const puntosGanador = (totalSets === 5 && setActual === 5) || (totalSets === 3 && setActual === 3) ? 15 : 25;
    
    // Verificar si ya hay un ganador del set
    if (puntosA >= puntosGanador || puntosB >= puntosGanador) {
      const diferencia = Math.abs(puntosA - puntosB);
      if (diferencia >= 2) {
        // El set ya está terminado, no permitir más puntos
        return;
      }
    }

    const estadoAnterior = guardarEstadoActual();
    const nuevoPuntosA = equipo === "A" ? puntosA + 1 : puntosA;
    const nuevoPuntosB = equipo === "B" ? puntosB + 1 : puntosB;

    setPuntosA(nuevoPuntosA);
    setPuntosB(nuevoPuntosB);

    // Si el equipo que hizo el punto NO estaba sacando, rotar
    if (equipo !== equipoSaca) {
      setRotando(true);
      setDireccionRotacion('horario');
      animarRotacion(equipo, 'horario');
      setTimeout(() => {
        setEquipoSaca(equipo);
        setRotando(false);
      }, 1000);
    }

    setHistorial([...historial, {
      tipo: "punto",
      equipo,
      data: { rotacion: equipo !== equipoSaca },
      estadoAnterior,
    }]);

    // Verificar fin de set
    if (nuevoPuntosA >= puntosGanador || nuevoPuntosB >= puntosGanador) {
      const diferencia = Math.abs(nuevoPuntosA - nuevoPuntosB);
      if (diferencia >= 2) {
        // Set terminado
        setTimeout(() => {
          setModal({
            visible: true,
            tipo: "confirmacion-set",
          });
        }, 300);
      }
    }

    // En set decisivo: cambiar de campo en punto 8 (mejor de 5) o punto 13 (mejor de 3)
    if (totalSets === 5 && setActual === 5) {
      if ((nuevoPuntosA === 8 || nuevoPuntosB === 8) && !cambioCampoSet5) {
        setCambioCampoSet5(true);
      }
    } else if (totalSets === 3 && setActual === 3) {
      if ((nuevoPuntosA === 13 || nuevoPuntosB === 13) && !cambioCampoSet5) {
        setCambioCampoSet5(true);
      }
    }
  };

  // ===== CONFIRMAR FIN DE SET =====
  const setsParaGanar = totalSets === 5 ? 3 : 2;

  const confirmarFinSet = () => {
    // Guardar marcador del set finalizado
    setMarcadorSets(prev => [...prev, { puntosA, puntosB }]);

    // Determinar ganador del set
    const newSetsA = puntosA > puntosB ? setsGanadosA + 1 : setsGanadosA;
    const newSetsB = puntosB > puntosA ? setsGanadosB + 1 : setsGanadosB;

    setSetsGanadosA(newSetsA);
    setSetsGanadosB(newSetsB);

    // Reiniciar marcador
    setPuntosA(0);
    setPuntosB(0);

    // Avanzar al siguiente set
    setSetActual(setActual + 1);

    // Reiniciar banderas de cambio de campo
    setCambioCampoSet5(false);
    setSwapLados(false);

    // Cerrar modal de confirmación de set
    setModal({ visible: false });

    // Comprobar si el partido ha terminado
    if (newSetsA >= setsParaGanar || newSetsB >= setsParaGanar) {
      const ganador = newSetsA >= setsParaGanar ? nombreEquipoA : nombreEquipoB;
      setTimeout(() => {
        setCustomAlert({
          visible: true,
          title: '¡Partido Finalizado!',
          message: `${ganador} ha ganado el partido ${newSetsA} - ${newSetsB}.\n\n¿Desea finalizar y pasar al acta de cierre?`,
          onConfirm: () => {
            setCustomAlert({ visible: false });
            onMatchFinished?.();
          },
        });
      }, 400);
    }
  };

  // ===== RENDERIZAR POSICIÓN =====
  const renderPosicion = (pos: Posicion, equipo: "A" | "B") => {
    const alineacion = equipo === "A" ? alineacionActualA : alineacionActualB;
    const dorsal = alineacion[pos] || "-";
    const esSacador = equipo === equipoSaca && pos === "I";
    
    // Determinar si es capitán
    const capitanPista = equipo === "A" ? capitanPistaA : capitanPistaB;
    const jugador = (equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB).find(j => j.dorsal === dorsal);
    const esCapitan = jugador && (jugador.id === capitanPista || jugador.esCapitan);

    // Obtener valor animado
    const animaciones = equipo === "A" ? animacionesA : animacionesB;
    const animatedValue = animaciones[pos];

    return (
      <View key={pos} style={styles.posicionWrapper}>
        <View style={styles.posicion}>
          <TouchableOpacity
            style={styles.posicionTouchable}
            onPress={() => {
              if (dorsal !== "-") {
                setModal({
                  visible: true,
                  tipo: "menu-accion",
                  equipo,
                  posicion: pos,
                  jugadorDorsal: dorsal,
                });
              }
            }}
            disabled={dorsal === "-" || rotando}
          >
            <Text style={styles.posLabel}>{pos}</Text>
            <View style={styles.divisor} />
            <Animated.Text 
              style={[
                styles.numLabel,
                {
                  opacity: animatedValue,
                  transform: [
                    { scale: animatedValue },
                  ]
                }
              ]}
            >
              {dorsal}
            </Animated.Text>
          </TouchableOpacity>
        </View>

        {esCapitan && (
          <View style={styles.capitanBadge}>
            <Text style={styles.capitanText}>C</Text>
          </View>
        )}

        {esSacador && (
          <View style={styles.serverBadge}>
            <VectorIcon name="sports-volleyball" size={16} color="#f59e0b" />
          </View>
        )}
      </View>
    );
  };

  const mapPosDerecha = (pos: Posicion): Posicion => {
    switch (pos) {
      case "IV": return "II";
      case "II": return "IV";
      case "V": return "I";
      case "I": return "V";
      default: return pos;
    }
  };

  // ===== USAR TIEMPO MUERTO =====
  const usarTiempo = (equipo: "A" | "B") => {
    const tiemposActuales = equipo === "A" ? (tiemposUsadosA[setActual] || 0) : (tiemposUsadosB[setActual] || 0);
    if (tiemposActuales >= 2) return;

    setCustomAlert({
      visible: true,
      title: "Confirmar Tiempo Muerto",
      message: `¿Está seguro de conceder tiempo muerto al Equipo ${equipo}?`,
      onConfirm: () => {
        const estadoAnterior = guardarEstadoActual();
        if (equipo === "A") {
          setTiemposUsadosA({ ...tiemposUsadosA, [setActual]: tiemposActuales + 1 });
        } else {
          setTiemposUsadosB({ ...tiemposUsadosB, [setActual]: tiemposActuales + 1 });
        }
        setHistorial([...historial, {
          tipo: "timeout",
          equipo,
          data: { tiemposActuales },
          estadoAnterior,
        }]);
        setEquipoTimeout(equipo);
        setSegundosRestantes(30);
        setTimeoutActivo(true);
        setCustomAlert({ visible: false });
      },
    });
  };

  // ===== FINALIZAR TIMEOUT =====
  const finalizarTimeout = () => {
    setTimeoutActivo(false);
    const tiemposActuales = equipoTimeout === "A" ? (tiemposUsadosA[setActual] || 0) : (tiemposUsadosB[setActual] || 0);
    
    if (tiemposActuales === 2) {
      setCustomAlert({
        visible: true,
        title: "Límite de Tiempos Alcanzado",
        message: `El Equipo ${equipoTimeout} ha utilizado sus 2 tiempos muertos. No puede solicitar más en este set.`,
        onConfirm: () => setCustomAlert({ visible: false }),
      });
    }
    setEquipoTimeout(null);
  };

  // ===== CORTAR TIMEOUT ANTES =====
  const cortarTimeout = () => {
    setCustomAlert({
      visible: true,
      title: "Finalizar Tiempo Muerto",
      message: "¿Desea finalizar el tiempo muerto antes de tiempo?",
      onConfirm: () => {
        finalizarTimeout();
        setCustomAlert({ visible: false });
      },
    });
  };

  // ===== REALIZAR SUSTITUCIÓN =====
  const realizarSustitucion = (equipo: "A" | "B", sale: string, entra: string) => {
    const sustitucionesActuales = equipo === "A" ? (sustitucionesUsadasA[setActual] || 0) : (sustitucionesUsadasB[setActual] || 0);
    
    if (sustitucionesActuales >= 6) {
      alert("Ya se han usado las 6 sustituciones de este set");
      return;
    }

    const estadoAnterior = guardarEstadoActual();

    // Verificar si el jugador que sale es el capitán en pista
    const capitanPista = equipo === "A" ? capitanPistaA : capitanPistaB;
    const jugadorQueSale = (equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB).find(j => j.dorsal === sale);
    const esCapitanSaliendo = jugadorQueSale && jugadorQueSale.id === capitanPista;

    // Actualizar alineación
    const alineacion = equipo === "A" ? { ...alineacionActualA } : { ...alineacionActualB };
    const posicion = Object.keys(alineacion).find(p => alineacion[p as Posicion] === sale) as Posicion | undefined;
    
    if (posicion) {
      alineacion[posicion] = entra;
      
      if (equipo === "A") {
        setAlineacionesA({ ...alineacionesA, [setActual]: alineacion });
        setSustitucionesUsadasA({ ...sustitucionesUsadasA, [setActual]: sustitucionesActuales + 1 });
      } else {
        setAlineacionesB({ ...alineacionesB, [setActual]: alineacion });
        setSustitucionesUsadasB({ ...sustitucionesUsadasB, [setActual]: sustitucionesActuales + 1 });
      }

      // Registrar sustitución
      setSustituciones([...sustituciones, { equipo, sale, entra, set: setActual }]);
      
      setHistorial([...historial, {
        tipo: "sustitucion",
        equipo,
        data: { sale, entra, posicion },
        estadoAnterior,
      }]);

      // Si el capitán sale del campo, mostrar modal para elegir nuevo capitán
      if (esCapitanSaliendo) {
        setTimeout(() => {
          setModal({
            visible: true,
            tipo: "seleccionar-capitan",
            equipo,
          });
        }, 300);
      } else {
        // Mostrar alerta si es la 5ª o 6ª sustitución
        const nuevasSustituciones = sustitucionesActuales + 1;
        if (nuevasSustituciones === 5 || nuevasSustituciones === 6) {
          setTimeout(() => {
            setCustomAlert({
              visible: true,
              title: "Aviso de Sustituciones",
              message: `El Equipo ${equipo} lleva ${nuevasSustituciones} sustituciones realizadas en este set.${nuevasSustituciones === 6 ? " Ha alcanzado el límite." : ""}`,
              onConfirm: () => setCustomAlert({ visible: false }),
            });
          }, 300);
        }
      }
    }

    setModal({ visible: false });
  };

  // ===== APLICAR AMONESTACIÓN =====
  const aplicarAmonestacion = (equipo: "A" | "B", jugador: string, tipo: AmonestacionTipo) => {
    const estadoAnterior = guardarEstadoActual();
    
    // Registrar amonestación
    setAmonestaciones([...amonestaciones, { equipo, jugador, tipo, set: setActual }]);

    setHistorial([...historial, {
      tipo: "amonestacion",
      equipo,
      data: { jugador, tipo },
      estadoAnterior,
    }]);

    // Tarjetas rojas dan punto al equipo contrario
    if (tipo === "roja" || tipo === "demora-roja" || tipo === "expulsion" || tipo === "descalificacion") {
      const equipoContrario = equipo === "A" ? "B" : "A";
      anotarPunto(equipoContrario);
    }

    setModal({ visible: false });
  };

  // ===== DESIGNAR CAPITÁN EN PISTA =====
  const designarCapitanPista = (equipo: "A" | "B", jugadorId: string) => {
    if (equipo === "A") {
      setCapitanPistaA(jugadorId);
    } else {
      setCapitanPistaB(jugadorId);
    }
    setModal({ visible: false });
  };

  // ===== REGISTRAR LESIÓN =====
  const registrarLesion = (equipo: "A" | "B", dorsal: string) => {
    const jugador = (equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB).find(j => j.dorsal === dorsal);
    if (!jugador) return;

    const nombreEquipo = equipo === "A" ? nombreEquipoA : nombreEquipoB;
    const marcador = `${puntosA}-${puntosB}`;
    const textoLesion = `El jugador ${jugador.apellidos}, ${jugador.nombre} con dorsal ${dorsal} del equipo ${nombreEquipo} se lesiona en el punto ${marcador} del set ${setActual}.`;
    
    // Añadir a observaciones
    const nuevasObservaciones = observaciones ? `${observaciones}\n\n${textoLesion}` : textoLesion;
    onObservacionesChange?.(nuevasObservaciones);

    // Mostrar modal de sustitución
    setModal({
      visible: true,
      tipo: "lesion",
      equipo,
      jugadorDorsal: dorsal,
    });
  };

  // ===== RENDERIZAR MODAL =====
  const renderModal = () => {
    if (!modal.visible) return null;

    if (modal.tipo === "confirmacion-set") {
      return (
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Fin del Set {setActual}</Text>
              <Text style={styles.modalSubtitle}>
                {puntosA} - {puntosB}
              </Text>
              <Text style={styles.modalSubtitle}>
                ¿Confirmar resultado?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setModal({ visible: false })}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={confirmarFinSet}
                >
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    // Modal de demora (para jugadores del banquillo)
    if (modal.tipo === "demora" && modal.equipo && modal.jugadorDorsal) {
      return (
        <CustomAlert
          visible={modal.visible}
          theme={theme}
          assets={assets!}
          message={`Banquillo #${modal.jugadorDorsal}\n\nSelecciona el tipo de demora:`}
          showResetButton={false}
          customButtons={[
            {
              text: "Demora Amarilla",
              icon: (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <VectorIcon name="demora" size={18} color="#f59e0b" />
                  <VectorIcon name="card-yellow" size={18} color="#f59e0b" />
                </View>
              ),
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "demora-amarilla"),
              isPrimary: false,
            },
            {
              text: "Demora Roja",
              icon: (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <VectorIcon name="demora" size={18} color="#ef4444" />
                  <VectorIcon name="card-red" size={18} color="#ef4444" />
                </View>
              ),
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "demora-roja"),
              isPrimary: false,
            },
          ]}
          onCancel={() => setModal({ visible: false })}
          onAccept={() => setModal({ visible: false })}
        />
      );
    }

    // Menú principal de acciones (jugador en pista)
    if (modal.tipo === "menu-accion" && modal.equipo && modal.jugadorDorsal && modal.posicion) {
      // Verificar si el capitán registrado está en pista
      const capitanRegistrado = modal.equipo === "A" ? capitanEquipoA : capitanEquipoB;
      const alineacionActual = modal.equipo === "A" ? alineacionActualA : alineacionActualB;
      const jugadoresEnCampo = Object.values(alineacionActual);
      const jugadoresEquipo = modal.equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB;
      const capitanEnPista = jugadoresEquipo.find(j => j.id === capitanRegistrado && jugadoresEnCampo.includes(j.dorsal || ""));
      const botonCapitanDeshabilitado = !!capitanEnPista;
      
      return (
        <CustomAlert
          visible={modal.visible}
          theme={theme}
          assets={assets!}
          message={`Jugador #${modal.jugadorDorsal}\n\nSelecciona una acción:`}
          showResetButton={false}
          customButtons={[
            {
              text: "SUSTITUIR",
              icon: <VectorIcon name="swap-horizontal" size={20} color={theme.primary} />,
              onPress: () => setModal({ ...modal, tipo: "sustitucion" }),
              isPrimary: true,
            },
            {
              text: "CAPITÁN EN PISTA",
              icon: <VectorIcon name="star" size={20} color={botonCapitanDeshabilitado ? "#9ca3af" : theme.primary} />,
              onPress: () => {
                if (botonCapitanDeshabilitado) return;
                const jugador = (modal.equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB)
                  .find(j => j.dorsal === modal.jugadorDorsal);
                if (jugador) {
                  designarCapitanPista(modal.equipo!, jugador.id);
                }
              },
              isPrimary: true,
              disabled: botonCapitanDeshabilitado,
            },
            {
              text: "LESIÓN",
              icon: <VectorIcon name="medical" size={20} color={theme.primary} />,
              onPress: () => registrarLesion(modal.equipo!, modal.jugadorDorsal!),
              isPrimary: true,
            },
            {
              text: "SANCIONAR",
              icon: <VectorIcon name="warning" size={20} color={theme.primary} />,
              onPress: () => setModal({ ...modal, tipo: "amonestacion" }),
              isPrimary: true,
            },
          ]}
          onCancel={() => setModal({ visible: false })}
          onAccept={() => setModal({ visible: false })}
        />
      );
    }

    // Modal de amonestaciones
    if (modal.tipo === "amonestacion" && modal.equipo && modal.jugadorDorsal) {
      return (
        <CustomAlert
          visible={modal.visible}
          theme={theme}
          assets={assets!}
          message={`Jugador #${modal.jugadorDorsal}\n\nSelecciona el tipo de amonestación:`}
          showResetButton={false}
          customButtons={[
            {
              text: "Amarilla",
              icon: <VectorIcon name="card-yellow" size={24} color={theme.primary} />,
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "amarilla"),
              isPrimary: false,
              outlined: true,
              outlineColor: theme.primary,
            },
            {
              text: "Roja",
              icon: <VectorIcon name="card-red" size={24} color={theme.primary} />,
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "roja"),
              isPrimary: false,
              outlined: true,
              outlineColor: theme.primary,
            },
            {
              text: "Expulsión",
              icon: <VectorIcon name="expulsion" size={24} color={theme.primary} />,
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "expulsion"),
              isPrimary: false,
              outlined: true,
              outlineColor: theme.primary,
            },
            {
              text: "Descalificación",
              icon: <VectorIcon name="descalificacion" size={24} color={theme.primary} />,
              onPress: () => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "descalificacion"),
              isPrimary: false,
              outlined: true,
              outlineColor: theme.primary,
            },
          ]}
          onCancel={() => setModal({ visible: false })}
          onAccept={() => setModal({ visible: false })}
        />
      );
    }

    // Modal para seleccionar nuevo capitán (después de sustituir al capitán)
    if (modal.tipo === "seleccionar-capitan" && modal.equipo) {
      const alineacionActual = modal.equipo === "A" ? alineacionActualA : alineacionActualB;
      const jugadoresEnPista = Object.entries(alineacionActual).map(([pos, dorsal]) => {
        const jugador = (modal.equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB).find(j => j.dorsal === dorsal);
        return jugador ? { ...jugador, posicion: pos } : null;
      }).filter(Boolean);

      return (
        <CustomAlert
          visible={modal.visible}
          theme={theme}
          assets={assets!}
          message={`El capitán ha sido sustituido.\n\nSelecciona el nuevo capitán en pista:`}
          showResetButton={false}
          customButtons={jugadoresEnPista.map(jugador => ({
            text: `#${jugador!.dorsal} - ${jugador!.nombre} ${jugador!.apellidos}`,
            onPress: () => designarCapitanPista(modal.equipo!, jugador!.id),
            isPrimary: false,
          }))}
          onCancel={() => setModal({ visible: false })}
          onAccept={() => setModal({ visible: false })}
        />
      );
    }

    // Modal de lesión (igual que sustitución)
    if (modal.tipo === "lesion" && modal.equipo && modal.jugadorDorsal) {
      const jugadoresBanquillo = modal.equipo === "A" ? jugadoresBanquilloA : jugadoresBanquilloB;
      
      return (
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Lesión - Jugador #{modal.jugadorDorsal}</Text>
              <Text style={styles.modalSubtitle}>Selecciona un jugador del banquillo:</Text>
              
              <ScrollView style={styles.modalList}>
                {jugadoresBanquillo.map(j => (
                  <TouchableOpacity
                    key={j.id}
                    style={styles.modalListItem}
                    onPress={() => realizarSustitucion(modal.equipo!, modal.jugadorDorsal!, j.dorsal || "")}
                  >
                    <Text style={styles.modalListItemText}>
                      #{j.dorsal} - {j.nombre} {j.apellidos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setModal({ visible: false })}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    // Modal de sustitución
    if (modal.tipo === "sustitucion" && modal.equipo && modal.jugadorDorsal) {
      const jugadoresBanquillo = modal.equipo === "A" ? jugadoresBanquilloA : jugadoresBanquilloB;
      
      return (
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sustituir Jugador #{modal.jugadorDorsal}</Text>
              <Text style={styles.modalSubtitle}>Selecciona un jugador del banquillo:</Text>
              
              <ScrollView style={styles.modalList}>
                {jugadoresBanquillo.map(j => (
                  <TouchableOpacity
                    key={j.id}
                    style={styles.modalListItem}
                    onPress={() => realizarSustitucion(modal.equipo!, modal.jugadorDorsal!, j.dorsal || "")}
                  >
                    <Text style={styles.modalListItemText}>
                      #{j.dorsal} - {j.nombre} {j.apellidos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setModal({ visible: false })}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
          {/* Botón Deshacer */}
          <TouchableOpacity
            style={[
              styles.undoButton,
              historial.length === 0 && styles.undoButtonDisabled,
            ]}
            onPress={deshacerAccion}
            disabled={historial.length === 0}
          >
            <VectorIcon name="undo" size={18} color={historial.length === 0 ? "#9ca3af" : "#fff"} />
            <Text style={[
              styles.undoButtonText,
              historial.length === 0 && styles.undoButtonTextDisabled,
            ]}>Deshacer</Text>
          </TouchableOpacity>

          {/* Marcador */}
          <View style={styles.scoreboardContainer}>
            <View style={styles.scoreboardTop}>
              {/* Sets ganados Equipo Izquierdo */}
              <View style={styles.setsIndicatorContainer}>
                {Array.from({ length: totalSets === 5 ? 3 : 2 }).map((_, index) => (
                  <View
                    key={`izq-${index}`}
                    style={[
                      styles.setCircle,
                      index < (equipoIzq === "A" ? setsGanadosA : setsGanadosB) && styles.setCircleFilled
                    ]}
                  />
                ))}
              </View>

              {/* Indicador de Set Actual */}
              <View style={styles.setIndicator}>
                <Text style={styles.setIndicatorText}>SET {setActual}/{totalSets}</Text>
              </View>

              {/* Sets ganados Equipo Derecho */}
              <View style={styles.setsIndicatorContainer}>
                {Array.from({ length: totalSets === 5 ? 3 : 2 }).map((_, index) => (
                  <View
                    key={`der-${index}`}
                    style={[
                      styles.setCircle,
                      index < (equipoDer === "A" ? setsGanadosA : setsGanadosB) && styles.setCircleFilled
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.scoreRow}>
              <TouchableOpacity 
                style={styles.teamScore}
                onPress={() => !rotando && anotarPunto(equipoIzq)}
                disabled={rotando}
              >
                <Text style={styles.teamNameScore}>{equipoIzq === "A" ? nombreEquipoA : nombreEquipoB}</Text>
                <Text style={styles.scoreValue}>{equipoIzq === "A" ? puntosA : puntosB}</Text>
              </TouchableOpacity>

              <Text style={styles.scoreDivider}>:</Text>

              <TouchableOpacity 
                style={styles.teamScore}
                onPress={() => !rotando && anotarPunto(equipoDer)}
                disabled={rotando}
              >
                <Text style={styles.teamNameScore}>{equipoDer === "A" ? nombreEquipoA : nombreEquipoB}</Text>
                <Text style={styles.scoreValue}>{equipoDer === "A" ? puntosA : puntosB}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo o Timer de Timeout */}
          <View style={styles.campoWrapper}>
            {timeoutActivo ? (
              // Timer de Tiempo Muerto
              <View style={styles.timeoutContainer}>
                <VectorIcon name="timer" size={60} color="#f59e0b" />
                <Text style={styles.timeoutTitle}>TIEMPO MUERTO</Text>
                <Text style={styles.timeoutEquipo}>Equipo {equipoTimeout}</Text>
                <Text style={styles.timeoutTimer}>{segundosRestantes}s</Text>
                <TouchableOpacity
                  style={styles.timeoutButton}
                  onPress={cortarTimeout}
                >
                  <Text style={styles.timeoutButtonText}>FINALIZAR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Campo normal
              <>
            {/* Botón SWAP en set decisivo (solo si van 2-2 o en set decisivo) */}
            {((totalSets === 5 && setActual === 5 && setsGanadosA === 2 && setsGanadosB === 2) ||
              (totalSets === 3 && setActual === 3 && setsGanadosA === 1 && setsGanadosB === 1)) && (
              <View style={styles.swapButtonContainer}>
                <TouchableOpacity
                  onPress={() => setSwapLados(!swapLados)}
                  style={styles.swapButton}
                >
                  <Image
                    source={icons.swap}
                    style={styles.swapIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* Grid del campo */}
            <View style={styles.campo}>
              <View style={styles.fila}>
                {/* Equipo izquierdo - traseras */}
                <View style={styles.columna}>
                  {(["V", "VI", "I"] as Posicion[]).map(pos => renderPosicion(pos, equipoIzq))}
                </View>

                {/* Equipo izquierdo - delanteras */}
                <View style={styles.columna}>
                  {(["IV", "III", "II"] as Posicion[]).map(pos => renderPosicion(pos, equipoIzq))}
                </View>

                {/* Red */}
                <View style={styles.red}></View>

                {/* Equipo derecho - delanteras */}
                <View style={styles.columna}>
                  {(["IV", "III", "II"] as Posicion[]).map(pos => renderPosicion(mapPosDerecha(pos), equipoDer))}
                </View>

                {/* Equipo derecho - traseras */}
                <View style={styles.columna}>
                  {(["V", "VI", "I"] as Posicion[]).map(pos => renderPosicion(mapPosDerecha(pos), equipoDer))}
                </View>
              </View>
            </View>
            </>
            )}
          </View>

          {/* Controles: Tiempos y Sustituciones por equipo */}
          <View style={styles.controlesSection}>
            <View style={styles.controlesRow}>
              {/* Equipo A */}
              <View style={styles.controlesEquipo}>
                <TouchableOpacity style={styles.controlBox} onPress={() => usarTiempo("A")}>
                  <View style={styles.controlIconRow}>
                    <VectorIcon name="clock-outline" size={20} color={theme.primary} />
                    <Text style={styles.controlTitle}>TIEMPOS</Text>
                  </View>
                  <Text style={styles.controlValue}>{tiemposUsadosA[setActual] || 0}/2</Text>
                </TouchableOpacity>
                <View style={styles.controlBox}>
                  <View style={styles.controlIconRow}>
                    <VectorIcon name="swap-horizontal" size={20} color={theme.primary} />
                    <Text style={styles.controlTitle}>SUSTITUCIONES</Text>
                  </View>
                  <Text style={styles.controlValue}>{sustitucionesUsadasA[setActual] || 0}/6</Text>
                </View>
              </View>

              {/* Equipo B */}
              <View style={styles.controlesEquipo}>
                <TouchableOpacity style={styles.controlBox} onPress={() => usarTiempo("B")}>
                  <View style={styles.controlIconRow}>
                    <VectorIcon name="clock-outline" size={20} color={theme.primary} />
                    <Text style={styles.controlTitle}>TIEMPOS</Text>
                  </View>
                  <Text style={styles.controlValue}>{tiemposUsadosB[setActual] || 0}/2</Text>
                </TouchableOpacity>
                <View style={styles.controlBox}>
                  <View style={styles.controlIconRow}>
                    <VectorIcon name="swap-horizontal" size={20} color={theme.primary} />
                    <Text style={styles.controlTitle}>SUSTITUCIONES</Text>
                  </View>
                  <Text style={styles.controlValue}>{sustitucionesUsadasB[setActual] || 0}/6</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Banquillo */}
          <View style={styles.banquilloSection}>
            <View style={styles.banquilloRow}>
              <View style={[styles.banquilloTeam, styles.banquilloLeft]}>
                <View style={styles.banquilloHeader}>
                  <Text style={styles.banquilloHeaderText}>Banquillo {nombreEquipoA}</Text>
                </View>
                <ScrollView style={styles.banquilloContent}>
                  {/* Staff ordenado por prioridad */}
                  {staffEquipoA
                    .sort((a, b) => {
                      const prioridadA = a.rol === 'entrenador' ? 1 : a.rol === 'entrenadorAsistente' ? 2 : 3;
                      const prioridadB = b.rol === 'entrenador' ? 1 : b.rol === 'entrenadorAsistente' ? 2 : 3;
                      return prioridadA - prioridadB;
                    })
                    .map((staff, index) => {
                      const codigo = staff.rol === 'entrenador' ? '1E' : staff.rol === 'entrenadorAsistente' ? 'EA' : 'D';
                      const esEntrenadorPrincipal = staff.rol === 'entrenador';
                      const nombreCompleto = `${staff.apellidos || ''}, ${staff.nombre || ''}`;
                      return (
                        <TouchableOpacity
                          key={staff.id}
                          style={styles.staffBanquilloItem}
                          onPress={() => {
                            setModal({
                              visible: true,
                              tipo: esEntrenadorPrincipal ? "demora" : "amonestacion",
                              equipo: "A",
                              jugadorDorsal: codigo,
                            });
                          }}
                        >
                          <Text style={styles.staffBanquilloCodigo}>{codigo}</Text>
                          <Text style={styles.staffBanquilloText}>{nombreCompleto}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  {/* Línea separadora si hay staff */}
                  {staffEquipoA.length > 0 && (
                    <View style={styles.banquilloSeparator} />
                  )}
                  {/* Jugadores en banquillo */}
                  <View style={styles.banquilloJugadores}>
                    {jugadoresBanquilloA.map(j => (
                      <TouchableOpacity
                        key={j.id}
                        style={styles.jugadorBanquillo}
                        onPress={() => {
                          setModal({
                            visible: true,
                            tipo: "demora",
                            equipo: "A",
                            jugadorDorsal: j.dorsal,
                          });
                        }}
                      >
                        <Text style={styles.jugadorBanquilloText}>{j.dorsal}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={[styles.banquilloTeam, styles.banquilloRight]}>
                <View style={styles.banquilloHeader}>
                  <Text style={styles.banquilloHeaderText}>Banquillo {nombreEquipoB}</Text>
                </View>
                <View style={styles.banquilloContent}>
                  {/* Staff ordenado por prioridad */}
                  {staffEquipoB
                    .sort((a, b) => {
                      const prioridadA = a.rol === 'entrenador' ? 1 : a.rol === 'entrenadorAsistente' ? 2 : 3;
                      const prioridadB = b.rol === 'entrenador' ? 1 : b.rol === 'entrenadorAsistente' ? 2 : 3;
                      return prioridadA - prioridadB;
                    })
                    .map((staff, index) => {
                      const codigo = staff.rol === 'entrenador' ? '1E' : staff.rol === 'entrenadorAsistente' ? 'EA' : 'D';
                      const esEntrenadorPrincipal = staff.rol === 'entrenador';
                      const nombreCompleto = `${staff.apellidos || ''}, ${staff.nombre || ''}`;
                      return (
                        <TouchableOpacity
                          key={staff.id}
                          style={styles.staffBanquilloItem}
                          onPress={() => {
                            setModal({
                              visible: true,
                              tipo: esEntrenadorPrincipal ? "demora" : "amonestacion",
                              equipo: "B",
                              jugadorDorsal: codigo,
                            });
                          }}
                        >
                          <Text style={styles.staffBanquilloCodigo}>{codigo}</Text>
                          <Text style={styles.staffBanquilloText}>{nombreCompleto}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  {/* Línea separadora si hay staff */}
                  {staffEquipoB.length > 0 && (
                    <View style={styles.banquilloSeparator} />
                  )}
                  {/* Jugadores en banquillo */}
                  <View style={styles.banquilloJugadores}>
                    {jugadoresBanquilloB.map(j => (
                      <TouchableOpacity
                        key={j.id}
                        style={styles.jugadorBanquillo}
                        onPress={() => {
                          setModal({
                            visible: true,
                            tipo: "demora",
                            equipo: "B",
                            jugadorDorsal: j.dorsal,
                          });
                        }}
                      >
                        <Text style={styles.jugadorBanquilloText}>{j.dorsal}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Botones QR */}
          <View style={styles.qrRow}>
              <TouchableOpacity
                style={[styles.qrButton, styles.qrButtonLeft]}
                onPress={() => {
                  setEquipoEscanear(equipoIzq);
                  setScannerVisible(true);
                }}
              >
                <Image source={icons.qr} style={styles.qrIcon} />
                <Text style={styles.qrButtonText}>{`ESCANEAR\nEQUIPO ${equipoIzq}`}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.qrButton, styles.qrButtonRight]}
                onPress={() => {
                  setEquipoEscanear(equipoDer);
                  setScannerVisible(true);
                }}
              >
                <Image source={icons.qr} style={styles.qrIcon} />
                <Text style={styles.qrButtonText}>{`ESCANEAR\nEQUIPO ${equipoDer}`}</Text>
              </TouchableOpacity>
            </View>
      </View>

      {/* Modal */}
      {renderModal()}

      {/* Scanner QR */}
      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          <Camera                                 
            style={{ flex: 1 }}
            cameraType={CameraType.Back}
            scanBarcode={true}
            showFrame={false}
            onReadCode={(event) => {
              setScannerVisible(false);
              
              // Parsear el QR
              let datosQR: any = {};
              try {
                datosQR = JSON.parse(event.nativeEvent.codeStringValue);
              } catch {
                setCustomAlert({
                  visible: true,
                  title: "QR inválido",
                  message: "No se pudo leer el código QR correctamente",
                  onConfirm: () => setCustomAlert({ visible: false }),
                });
                return;
              }

              // Obtener alineación del QR
              const alineacion: { [pos: string]: string } =
                datosQR.valores && typeof datosQR.valores === "object"
                  ? datosQR.valores
                  : {};

              // Obtener lista de jugadores del equipo
              const jugadoresEquipo = equipoEscanear === "A" ? jugadoresEquipoA : jugadoresEquipoB;
              const dorsalesRegistrados = jugadoresEquipo.map(j => j.dorsal);

              // Validar que todos los dorsales del QR estén registrados
              const dorsalesQR = Object.values(alineacion).filter(d => d && d !== "-");
              const dorsalesNoRegistrados = dorsalesQR.filter(d => !dorsalesRegistrados.includes(d));

              if (dorsalesNoRegistrados.length > 0) {
                const equipoNombre = equipoEscanear === "A" ? nombreEquipoA : nombreEquipoB;
                setCustomAlert({
                  visible: true,
                  title: "Jugadores no registrados",
                  message: `Los siguientes números no están registrados en la plantilla de ${equipoNombre}:\n\n${dorsalesNoRegistrados.join(", ")}\n\nRegistra estos jugadores en la fase de Plantillas antes de escanear el QR.`,
                  onConfirm: () => setCustomAlert({ visible: false }),
                });
                return;
              }

              // Guardar alineación en el set actual
              const nuevaAlineacion: Alineacion = {};
              Object.keys(alineacion).forEach(pos => {
                if (["I", "II", "III", "IV", "V", "VI"].includes(pos)) {
                  nuevaAlineacion[pos as Posicion] = alineacion[pos];
                }
              });

              if (equipoEscanear === "A") {
                setAlineacionesA({
                  ...alineacionesA,
                  [setActual]: nuevaAlineacion,
                });
              } else {
                setAlineacionesB({
                  ...alineacionesB,
                  [setActual]: nuevaAlineacion,
                });
              }

              setCustomAlert({
                visible: true,
                title: "Alineación cargada",
                message: `Se ha cargado correctamente la alineación del Equipo ${equipoEscanear} para el set ${setActual}`,
                onConfirm: () => setCustomAlert({ visible: false }),
              });
            }}
          />

          {/* Overlay cuadrado centrado */}
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
          </View>

          <TouchableOpacity
            style={styles.scannerCancelButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.scannerCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Custom Alert (reusable component) */}
      {assets && (
        <CustomAlert
          visible={customAlert.visible}
          theme={theme}
          assets={assets}
          message={(customAlert.title ? customAlert.title + "\n\n" : "") + (customAlert.message || "")}
          showResetButton={false}
          onCancel={() => setCustomAlert({ visible: false })}
          onAccept={() => {
            customAlert.onConfirm?.();
            setCustomAlert({ visible: false });
          }}
        />
      )}
    </View>
  );
}
