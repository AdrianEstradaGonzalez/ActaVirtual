import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import { createPartidoStyles } from "./styles/PartidoStyles";
import { useCommunity } from "../../context/CommunityContext";
import VectorIcon from "../../components/VectorIcon";
import CustomAlert from "../../components/CustomAlert";
import { Jugador, Categoria, StaffMember } from "../../types/MockData";

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
  tipo?: "menu-accion" | "sustitucion" | "amonestacion" | "capitan" | "confirmacion-set" | "demora";
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

  // Alineaciones por set
  const [alineacionesA, setAlineacionesA] = useState<{ [set: number]: Alineacion }>({});
  const [alineacionesB, setAlineacionesB] = useState<{ [set: number]: Alineacion }>({});

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

  // ===== EFECTO PARA TIMER DE TIMEOUT =====
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (timeoutActivo && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes(prev => prev - 1);
      }, 1000);
    } else if (timeoutActivo && segundosRestantes === 0) {
      finalizarTimeout();
    }
    return () => clearInterval(intervalo);
  }, [timeoutActivo, segundosRestantes]);

  // ===== GUARDAR ESTADO ACTUAL =====
  const guardarEstadoActual = (): AccionHistorial["estadoAnterior"] => ({
    puntosA,
    puntosB,
    setActual,
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

    setPuntosA(estado.puntosA);
    setPuntosB(estado.puntosB);
    setSetActual(estado.setActual);
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

  // ===== ANOTAR PUNTO =====
  const anotarPunto = (equipo: "A" | "B") => {
    const estadoAnterior = guardarEstadoActual();
    const nuevoPuntosA = equipo === "A" ? puntosA + 1 : puntosA;
    const nuevoPuntosB = equipo === "B" ? puntosB + 1 : puntosB;

    setPuntosA(nuevoPuntosA);
    setPuntosB(nuevoPuntosB);

    // Si el equipo que hizo el punto NO estaba sacando, rotar
    if (equipo !== equipoSaca) {
      rotar(equipo);
      setEquipoSaca(equipo);
    }

    setHistorial([...historial, {
      tipo: "punto",
      equipo,
      data: { rotacion: equipo !== equipoSaca },
      estadoAnterior,
    }]);

    // Verificar fin de set
    const puntosGanador = totalSets === 5 && setActual === 5 ? 15 : 25;
    
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
  const confirmarFinSet = () => {
    // Determinar ganador del set
    if (puntosA > puntosB) {
      setSetsGanadosA(setsGanadosA + 1);
    } else {
      setSetsGanadosB(setsGanadosB + 1);
    }

    // Reiniciar marcador
    setPuntosA(0);
    setPuntosB(0);

    // Avanzar al siguiente set
    setSetActual(setActual + 1);

    // Reiniciar banderas de cambio de campo
    setCambioCampoSet5(false);
    setSwapLados(false);

    // Cerrar modal
    setModal({ visible: false });
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
            disabled={dorsal === "-"}
          >
            <Text style={styles.posLabel}>{pos}</Text>
            <View style={styles.divisor} />
            <Text style={styles.numLabel}>{dorsal}</Text>
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
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Amonestaciones - Banquillo #{modal.jugadorDorsal}</Text>
              
              <View style={styles.amonestacionButtons}>
                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.amarillaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "demora-amarilla")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.amarillaText]}>Demora Amarilla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.rojaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "demora-roja")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.rojaText]}>Demora Roja</Text>
                </TouchableOpacity>
              </View>

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

    // Menú principal de acciones (jugador en pista)
    if (modal.tipo === "menu-accion" && modal.equipo && modal.jugadorDorsal && modal.posicion) {
      return (
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Acciones - Jugador #{modal.jugadorDorsal}</Text>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, { marginBottom: 10 }]}
                onPress={() => setModal({ ...modal, tipo: "sustitucion" })}
              >
                <Text style={styles.modalButtonText}>SUSTITUIR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, { marginBottom: 10 }]}
                onPress={() => {
                  const jugador = (modal.equipo === "A" ? jugadoresEquipoA : jugadoresEquipoB)
                    .find(j => j.dorsal === modal.jugadorDorsal);
                  if (jugador) {
                    designarCapitanPista(modal.equipo!, jugador.id);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>CAPITÁN EN PISTA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger, { marginBottom: 10 }]}
                onPress={() => setModal({ ...modal, tipo: "amonestacion" })}
              >
                <Text style={styles.modalButtonText}>AMONESTAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setModal({ visible: false })}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    // Modal de amonestaciones
    if (modal.tipo === "amonestacion" && modal.equipo && modal.jugadorDorsal) {
      return (
        <Modal transparent animationType="fade" visible={modal.visible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Amonestar Jugador #{modal.jugadorDorsal}</Text>
              
              <View style={styles.amonestacionButtons}>
                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.amarillaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "amarilla")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.amarillaText]}>Amarilla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.rojaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "roja")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.rojaText]}>Roja</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.rojaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "expulsion")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.rojaText]}>Expulsión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.amonestacionButton, styles.rojaButton]}
                  onPress={() => aplicarAmonestacion(modal.equipo!, modal.jugadorDorsal!, "descalificacion")}
                >
                  <Text style={[styles.amonestacionButtonText, styles.rojaText]}>Descalificación</Text>
                </TouchableOpacity>
              </View>

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
              <View style={styles.setIndicator}>
                <Text style={styles.setIndicatorText}>SET {setActual}/{totalSets}</Text>
              </View>
              <Text style={{ color: "#9ca3af", fontSize: 12, fontWeight: "600" }}>
                Sets: {setsGanadosA} - {setsGanadosB}
              </Text>
            </View>

            <View style={styles.scoreRow}>
              <TouchableOpacity 
                style={styles.teamScore}
                onPress={() => anotarPunto(equipoIzq)}
              >
                <Text style={styles.teamNameScore}>{equipoIzq === "A" ? nombreEquipoA : nombreEquipoB}</Text>
                <Text style={styles.scoreValue}>{equipoIzq === "A" ? puntosA : puntosB}</Text>
              </TouchableOpacity>

              <Text style={styles.scoreDivider}>:</Text>

              <TouchableOpacity 
                style={styles.teamScore}
                onPress={() => anotarPunto(equipoDer)}
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
              <View
                style={{
                  position: "absolute",
                  top: -18,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                  zIndex: 30,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSwapLados(!swapLados)}
                  style={{
                    backgroundColor: "#facc15",
                    padding: 6,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: "#d97706",
                  }}
                >
                  <Image
                    source={icons.swap}
                    style={{ width: 24, height: 24, tintColor: "#000" }}
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

          {/* Botones QR */}
          {(jugadoresEquipoA.length === 0 || jugadoresEquipoB.length === 0) && (
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
          )}

          {/* Banquillo */}
          <View style={styles.banquilloSection}>
            <View style={styles.banquilloRow}>
              <View style={[styles.banquilloTeam, styles.banquilloLeft]}>
                <View style={styles.banquilloHeader}>
                  <Text style={styles.banquilloHeaderText}>Banquillo {nombreEquipoA}</Text>
                </View>
                <View style={styles.banquilloContent}>
                  <View style={styles.banquilloJugadores}>
                    {/* Staff primero */}
                    {staffEquipoA.map((staff, index) => {
                      const codigo = staff.rol === 'entrenador' ? '1E' : staff.rol === 'entrenadorAsistente' ? 'EA' : 'D';
                      const esEntrenadorPrincipal = staff.rol === 'entrenador';
                      return (
                        <TouchableOpacity
                          key={staff.id}
                          style={[styles.jugadorBanquillo, styles.staffBanquillo]}
                          onPress={() => {
                            setModal({
                              visible: true,
                              tipo: esEntrenadorPrincipal ? "demora" : "amonestacion",
                              equipo: "A",
                              jugadorDorsal: codigo,
                            });
                          }}
                        >
                          <Text style={styles.jugadorBanquilloText}>{codigo}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    {/* Jugadores en banquillo */}
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
                </View>
              </View>

              <View style={[styles.banquilloTeam, styles.banquilloRight]}>
                <View style={styles.banquilloHeader}>
                  <Text style={styles.banquilloHeaderText}>Banquillo {nombreEquipoB}</Text>
                </View>
                <View style={styles.banquilloContent}>
                  <View style={styles.banquilloJugadores}>
                    {/* Staff primero */}
                    {staffEquipoB.map((staff, index) => {
                      const codigo = staff.rol === 'entrenador' ? '1E' : staff.rol === 'entrenadorAsistente' ? 'EA' : 'D';
                      const esEntrenadorPrincipal = staff.rol === 'entrenador';
                      return (
                        <TouchableOpacity
                          key={staff.id}
                          style={[styles.jugadorBanquillo, styles.staffBanquillo]}
                          onPress={() => {
                            setModal({
                              visible: true,
                              tipo: esEntrenadorPrincipal ? "demora" : "amonestacion",
                              equipo: "B",
                              jugadorDorsal: codigo,
                            });
                          }}
                        >
                          <Text style={styles.jugadorBanquilloText}>{codigo}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    {/* Jugadores en banquillo */}
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

          {/* Controles: Tiempos y Sustituciones por equipo */}
          <View style={styles.controlesSection}>
            <View style={styles.controlesRow}>
              {/* Equipo A */}
              <View style={styles.controlesEquipo}>
                <TouchableOpacity style={styles.controlBox} onPress={() => usarTiempo("A")}>
                  <Text style={styles.controlTitle}>TIEMPOS</Text>
                  <Text style={styles.controlValue}>{tiemposUsadosA[setActual] || 0}/2</Text>
                </TouchableOpacity>
                <View style={styles.controlBox}>
                  <Text style={styles.controlTitle}>SUSTITUCIONES</Text>
                  <Text style={styles.controlValue}>{sustitucionesUsadasA[setActual] || 0}/6</Text>
                </View>
              </View>

              {/* Equipo B */}
              <View style={styles.controlesEquipo}>
                <TouchableOpacity style={styles.controlBox} onPress={() => usarTiempo("B")}>
                  <Text style={styles.controlTitle}>TIEMPOS</Text>
                  <Text style={styles.controlValue}>{tiemposUsadosB[setActual] || 0}/2</Text>
                </TouchableOpacity>
                <View style={styles.controlBox}>
                  <Text style={styles.controlTitle}>SUSTITUCIONES</Text>
                  <Text style={styles.controlValue}>{sustitucionesUsadasB[setActual] || 0}/6</Text>
                </View>
              </View>
            </View>
          </View>
      </View>

      {/* Modal */}
      {renderModal()}

      {/* Scanner QR */}
      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Camera
            style={{ flex: 1 }}
            cameraType={CameraType.Back}
            scanBarcode={true}
            showFrame={false}
            onReadCode={(event) => {
              setScannerVisible(false);
              onEscanear?.(equipoEscanear);
            }}
          />

          {/* Overlay cuadrado centrado */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 250,
                height: 250,
                borderColor: "white",
                borderWidth: 2,
                backgroundColor: "transparent",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 50,
              alignSelf: "center",
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: theme?.primaryDark || "#f59e0b",
              borderRadius: 8,
            }}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Cancelar</Text>
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
