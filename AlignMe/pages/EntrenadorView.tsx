import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEntrenadorStyles } from "../styles/EntrenadorStyles";
import { useCommunity } from "../context/CommunityContext";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/Navigation";
import NavBar from "./NavBar";

type NavigationProp = StackNavigationProp<RootStackParamList, "Entrenador">;

const icons = {
  home: require("../assets/icons/home.png"),
  swap: require("../assets/icons/swap.png"),
  left: require("../assets/icons/left.png"),
  right: require("../assets/icons/right.png"),
  rotateLeft: require("../assets/icons/rotate-left-arrow-icon.webp"),
  rotateRight: require("../assets/icons/rotate-right-arrow-icon.webp"),
  trash: require("../assets/icons/trash.png"),
  qr: require("../assets/icons/qr.png"),
};

const posiciones6x6 = {
  delanteras: ["IV", "III", "II"],
  traseras: ["V", "VI", "I"],
};

const posiciones4x4 = {
  delanteras: ["IV", "III", "II"],
  traseras: ["I"],
};

const STORAGE_KEY_ENTRENADOR_MODO = '@alignme_entrenador_modo';
const STORAGE_KEY_ENTRENADOR_CODIGO = '@alignme_entrenador_codigo';
const STORAGE_KEY_ENTRENADOR_VALORES = '@alignme_entrenador_valores';

export default function EntrenadorView() {
  const { theme, assets, communityId } = useCommunity();
  const [modo, setModo] = useState<"6x6" | "4x4">("6x6");
  const [codigoEquipo, setCodigoEquipo] = useState<string>("");
  const [equipo, setEquipo] = useState<"A" | "B">("A");
  const [setActual, setSetActual] = useState<number>(1);
  const [valores, setValores] = useState<{ [pos: string]: string }>({});
  const navigation = useNavigation<NavigationProp>();

  // Cargar datos guardados al iniciar
  useEffect(() => {
    loadSavedData();
  }, []);

  // Guardar automáticamente cuando cambian los datos
  useEffect(() => {
    saveData();
  }, [modo, codigoEquipo, valores]);

  const loadSavedData = async () => {
    try {
      const savedModo = await AsyncStorage.getItem(STORAGE_KEY_ENTRENADOR_MODO);
      const savedCodigo = await AsyncStorage.getItem(STORAGE_KEY_ENTRENADOR_CODIGO);
      const savedValores = await AsyncStorage.getItem(STORAGE_KEY_ENTRENADOR_VALORES);

      if (savedModo) {
        setModo(savedModo as "6x6" | "4x4");
      }
      if (savedCodigo) {
        setCodigoEquipo(savedCodigo);
      }
      if (savedValores) {
        setValores(JSON.parse(savedValores));
      }
    } catch (error) {
      console.error('Error cargando datos guardados:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ENTRENADOR_MODO, modo);
      await AsyncStorage.setItem(STORAGE_KEY_ENTRENADOR_CODIGO, codigoEquipo);
      await AsyncStorage.setItem(STORAGE_KEY_ENTRENADOR_VALORES, JSON.stringify(valores));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  const clearRotation = async () => {
    setValores({});
    setCodigoEquipo("");
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_ENTRENADOR_VALORES);
      await AsyncStorage.removeItem(STORAGE_KEY_ENTRENADOR_CODIGO);
    } catch (error) {
      console.error('Error limpiando rotación:', error);
    }
  };

  if (!theme) return null;
  
  const styles = createEntrenadorStyles(theme);

  const TOTAL_SETS = modo === "6x6" ? 5 : 3;

    const generarQR = () => {
    const posicionesRequeridas = modo === "6x6" ? 6 : 4;
    const posicionesLlenas = Object.values(valores).filter((v) => v && v.trim() !== "").length;

    if (posicionesLlenas < posicionesRequeridas) {
      Alert.alert(
        "Alineación incompleta",
        `Debes ingresar todos los números antes de generar el QR.`
      );
      return;
    }

    const datos = { modo, codigoEquipo, valores };
    navigation.navigate("QRView", { data: JSON.stringify(datos) });
  };


  const toggleModo = () => {
    setModo((m) => (m === "6x6" ? "4x4" : "6x6"));
    setValores({});
    setSetActual(1);
  };

  const getOrden = (): string[] =>
    modo === "6x6" ? ["I", "VI", "V", "IV", "III", "II"] : ["I", "IV", "III", "II"];

  const rotateClockwise = () => {
    const orden = getOrden();
    const old = { ...valores };
    const nuevo: { [pos: string]: string } = { ...valores };

    orden.forEach((from, i) => {
      const to = orden[(i + 1) % orden.length];
      nuevo[to] = old[from] ?? "";
    });

    setValores(nuevo);
  };

  const rotateCounterclockwise = () => {
    const orden = getOrden();
    const old = { ...valores };
    const nuevo: { [pos: string]: string } = { ...valores };

    orden.forEach((from, i) => {
      const to = orden[(i - 1 + orden.length) % orden.length];
      nuevo[to] = old[from] ?? "";
    });

    setValores(nuevo);
  };

  const renderPosicion = (pos: string) => (
    <View key={pos} style={styles.posicion}>
      <Text style={styles.label}>{pos}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={2}
        value={valores[pos] || ""}
        onChangeText={(text) => {
          if (!text) {
            // vacío permitido
            setValores((prev) => ({ ...prev, [pos]: "" }));
            return;
          }

          if (!/^\d+$/.test(text)) {
            // solo dígitos
            return;
          }

          const num = parseInt(text, 10);
          if (isNaN(num) || num < 1 || num > 99) {
            return; // no actualizamos hasta que sea válido
          }

          // ✅ aquí NO comprobamos duplicados, solo actualizamos
          setValores((prev) => ({ ...prev, [pos]: text }));
        }}
        onEndEditing={(e) => {
          const text = e.nativeEvent.text ?? "";
          if (!text) return;

          const num = parseInt(text, 10);
          if (isNaN(num) || num < 1 || num > 99) {
            Alert.alert("Número inválido", "Debe ser un número entre 1 y 99.");
            setValores((prev) => ({ ...prev, [pos]: "" }));
            return;
          }

          // ✅ aquí sí comprobamos duplicados
          setValores((prev) => {
            const isDuplicate = Object.entries(prev).some(
              ([key, value]) => key !== pos && value === text
            );
            if (isDuplicate) {
              Alert.alert(
                "Número repetido",
                `El número ${text} ya está asignado en otra posición.`
              );
              return { ...prev, [pos]: "" };
            }
            return prev;
          });
        }}
      />
    </View>
  );

  const posiciones = modo === "6x6" ? posiciones6x6 : posiciones4x4;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
          <NavBar 
            modo={modo} 
            toggleModo={toggleModo}
            valoresEquipos={{ 1: { A: valores } }}
            onClearRotations={clearRotation}
            showResetButton={false}
            alertMessage="¿Está seguro de que quiere salir? Se perderá la rotación."
          />

          <View style={styles.container}>
            {/* Barra superior */}
            <View style={styles.barraControl}>
                {/* Fondo de logo (dependiente de comunidad). Se pone atrás usando zIndex y pointerEvents none */}
                <Image
                  source={
                    communityId === 'baleares'
                      ? assets?.topRightLogo
                      : assets?.appLogoWithLetters
                  }
                  style={styles.backgroundLogo}
                  // keep it purely decorative
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                />
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel} numberOfLines={1} ellipsizeMode="tail">
                  Código
                </Text>

                <TextInput
                  style={styles.codigoEquipo}
                  maxLength={3}
                  value={codigoEquipo}
                  onChangeText={(text) => setCodigoEquipo(text.toUpperCase())}
                  placeholder="COD"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Equipo</Text>
                <TouchableOpacity
                  style={styles.equipoSelector}
                  onPress={() => setEquipo((e) => (e === "A" ? "B" : "A"))}
                >
                  <Text style={styles.equipoText}>{equipo}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fila de sets */}
            <View style={styles.filaSets}>
              <TouchableOpacity
                onPress={() => setSetActual(Math.max(1, setActual - 1))}
                style={styles.setButton}
              >
                <Image source={icons.left} style={{ width: 20, height: 20, tintColor: "#fff" }} />
              </TouchableOpacity>
              <View style={styles.setDisplay}>
                <Text style={styles.setText}>{`SET ${setActual}`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSetActual(Math.min(TOTAL_SETS, setActual + 1))}
                style={styles.setButton}
              >
                <Image source={icons.right} style={{ width: 20, height: 20, tintColor: "#fff" }} />
              </TouchableOpacity>
            </View>

            {/* Campo */}
            <View style={styles.campo}>
              <View style={styles.fila}>
                {posiciones.delanteras.map((pos) => renderPosicion(pos))}
              </View>

              <View style={styles.lineaSeparadora} />

        {modo === "6x6" ? (
          <View style={styles.fila}>
            {posiciones.traseras.map((pos) => renderPosicion(pos))}
          </View>
        ) : (
          <View style={styles.fila}>
            <View style={{ flex: 1 }} />
            {renderPosicion("I")}
            <View style={{ flex: 1 }} />
          </View>
        )}


              {/* Botones de acciones */}
              <View style={styles.botonesContainer}>
                <TouchableOpacity onPress={rotateClockwise} style={styles.botonFlotante}>
                  <Image
                    source={icons.rotateRight}
                    style={{ width: 26, height: 26, tintColor: "#fff" }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setValores({})}
                  style={[styles.botonFlotante, styles.botonCentral]}
                >
                  <Image
                    source={icons.trash}
                    style={{ width: 24, height: 24, tintColor: "#fff" }}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={rotateCounterclockwise} style={styles.botonFlotante}>
                  <Image
                    source={icons.rotateLeft}
                    style={{ width: 26, height: 26, tintColor: "#fff" }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón QR */}
            <TouchableOpacity style={styles.qrButton} onPress={generarQR}>
              <Image
                source={icons.qr}
                style={{ width: 32, height: 32, tintColor: "#fff", marginBottom: 6 }}
              />
              <Text style={styles.qrButtonText}>GENERAR CÓDIGO QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
