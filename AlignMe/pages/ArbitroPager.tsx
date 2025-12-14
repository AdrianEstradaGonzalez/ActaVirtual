// ArbitroPager.tsx
import { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  Modal,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType } from "react-native-camera-kit";

import ArbitroView from "./ArbitroView";
import MedioCampoView from "./MedioCampoView";
import { useCommunity } from "../context/CommunityContext";

const { width } = Dimensions.get("window");

const STORAGE_KEY_ALINEACIONES = '@alignme_alineaciones';
const STORAGE_KEY_MODO = '@alignme_modo';
const STORAGE_KEY_SWAP = '@alignme_swap';

export default function ArbitroPager() {
  const { theme } = useCommunity();
  const [modo, setModo] = useState<"6x6" | "4x4">("6x6");
  const [setActual, setSetActual] = useState<number>(1);
  const [swapLados, setSwapLados] = useState(false); 

  // 🔹 valoresEquipos[set][A|B] = { pos: numero, codigo?: string }
  const [valoresEquipos, setValoresEquipos] = useState<{
    [set: number]: {
      A?: { [pos: string]: string } & { codigo?: string };
      B?: { [pos: string]: string } & { codigo?: string };
    };
  }>({});

  const scrollRef = useRef<ScrollView>(null);

  const [scannerVisible, setScannerVisible] = useState(false);
  const [equipoEscanear, setEquipoEscanear] = useState<"A" | "B">("A");

  // 🔹 Cargar datos guardados al iniciar
  useEffect(() => {
    loadSavedData();
    // Siempre arrancamos mostrando al árbitro (pantalla central)
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: width, animated: false });
    }, 0);
  }, []);

  // 🔹 Guardar automáticamente cuando cambian las alineaciones, modo o swap
  useEffect(() => {
    saveData();
  }, [valoresEquipos, modo, swapLados]);

  const loadSavedData = async () => {
    try {
      const savedAlineaciones = await AsyncStorage.getItem(STORAGE_KEY_ALINEACIONES);
      const savedModo = await AsyncStorage.getItem(STORAGE_KEY_MODO);
      const savedSwap = await AsyncStorage.getItem(STORAGE_KEY_SWAP);

      if (savedAlineaciones) {
        setValoresEquipos(JSON.parse(savedAlineaciones));
      }
      if (savedModo) {
        setModo(savedModo as "6x6" | "4x4");
      }
      if (savedSwap) {
        setSwapLados(JSON.parse(savedSwap));
      }
    } catch (error) {
      console.error('Error cargando datos guardados:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ALINEACIONES, JSON.stringify(valoresEquipos));
      await AsyncStorage.setItem(STORAGE_KEY_MODO, modo);
      await AsyncStorage.setItem(STORAGE_KEY_SWAP, JSON.stringify(swapLados));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  const clearAllRotations = async () => {
    setValoresEquipos({});
    setSwapLados(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_ALINEACIONES);
      await AsyncStorage.removeItem(STORAGE_KEY_SWAP);
    } catch (error) {
      console.error('Error limpiando rotaciones:', error);
    }
  };

  const openScanner = (eq: "A" | "B") => {
    setEquipoEscanear(eq);
    setScannerVisible(true);
  };

  const handleBarCodeRead = (event: {
    nativeEvent: { codeStringValue: string };
  }) => {
    setScannerVisible(false);

    let datosQR: any = {};
    try {
      datosQR = JSON.parse(event.nativeEvent.codeStringValue);
    } catch {
      Alert.alert("QR inválido", "No se pudo leer el QR correctamente");
      return;
    }

    // 🔹 Guardar modo si viene en el QR
    if (datosQR.modo && (datosQR.modo === "6x6" || datosQR.modo === "4x4")) {
      setModo(datosQR.modo);
    }

    // 🔹 Alineación directamente en datosQR.valores
    const alineacion: { [pos: string]: string } =
      datosQR.valores && typeof datosQR.valores === "object"
        ? datosQR.valores
        : {};

    const codigo = datosQR.codigoEquipo || null;

    // 🔹 Guardar SIEMPRE en el set actual
    setValoresEquipos((prev) => ({
      ...prev,
      [setActual]: {
        ...(prev[setActual] || {}),
        [equipoEscanear]: {
          ...(alineacion || {}),
          codigo,
        },
      },
    }));

    // 🔹 Scroll automático al lado correcto
const isAOnLeft = setActual % 2 === 1 ? !swapLados : swapLados;
const xPos =
  (equipoEscanear === "A" && isAOnLeft) ||
  (equipoEscanear === "B" && !isAOnLeft)
    ? 0
    : width * 2;
scrollRef.current?.scrollTo({ x: xPos, animated: true });

  };

  // 🔹 Determinar qué equipo va en cada lado (con swap en set 5 ó set 3 según modo)
let equipoIzq = setActual % 2 === 1 ? "A" : "B";
let equipoDer = setActual % 2 === 1 ? "B" : "A";

if ((modo === "6x6" && setActual === 5) || (modo === "4x4" && setActual === 3)) {
  if (swapLados) {
    [equipoIzq, equipoDer] = [equipoDer, equipoIzq];
  }
}



  return (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* Lado Izquierdo */}
        <View style={{ width }}>
          <MedioCampoView
            modo={modo}
            lado="izq"
            setActual={setActual}
            onEscanear={openScanner}
            valoresQR={valoresEquipos[setActual]?.[equipoIzq as "A" | "B"]}
            scrollRef={scrollRef}
            swapLados={swapLados}   // 👈 se lo pasamos
          />
        </View>

        {/* Árbitro (central) */}
        <View style={{ width }}>
          <ArbitroView
            modoProp={modo}
            setModoProp={setModo}
            setActualProp={setActual}
            setSetActualProp={setSetActual}
            valoresEquipos={valoresEquipos}
            onEscanear={openScanner}
            swapLados={swapLados}       // 👈 se lo pasamos
            setSwapLados={setSwapLados} // 👈 para que ArbitroView lo pueda modificar
            onClearRotations={clearAllRotations}
          />
        </View>

        {/* Lado Derecho */}
        <View style={{ width }}>
          <MedioCampoView
            modo={modo}
            lado="der"
            setActual={setActual}
            onEscanear={openScanner}
            valoresQR={valoresEquipos[setActual]?.[equipoDer as "A" | "B"]}
            scrollRef={scrollRef}
            swapLados={swapLados} // 👈 también aquí
          />
        </View>
      </ScrollView>

      {/* Scanner */}
      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Camera
            style={{ flex: 1 }}
            cameraType={CameraType.Back}
            scanBarcode={true}
            showFrame={false}
            onReadCode={handleBarCodeRead}
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
    </>
  );
}
