import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../config/themes";

const { width, height } = Dimensions.get("window");

// 🔹 Escala base según pantalla de referencia 360x640
const BASE_WIDTH = 360;
const BASE_HEIGHT = 640;
const rawScale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

// 🔹 Limitar escala (ni muy chico ni gigante)
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.2;
let scale = Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);

// 🔹 Detectar pantallas pequeñas (<360px ancho)
const isSmallScreen = width < 360;
const smallFactor = isSmallScreen ? 0.75 : 1; // reduce 25% en pantallas chicas

// 🔹 Detectar tablets/grandes
const isTablet = width >= 700 || height >= 1000;
const bigFactor = isTablet ? 0.8 : 1; // reduce 15% en tablets

// 🔹 Escala final ajustada
scale = scale * bigFactor;

// 🔹 Medidas principales
const campoSize = width * 0.85 * scale;
const posicionSize = (campoSize - 32) / 4;

/**
 * 🎨 DYNAMIC ARBITRO STYLES FACTORY
 * ==================================
 * Genera estilos dinámicos basados en el tema de la comunidad
 */
export const createArbitroStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },


  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 70 * scale,
  },

  campo: {
    width: campoSize,
    aspectRatio: 1,
    backgroundColor: theme.fieldBackground,
    borderRadius: 16 * scale,
    borderWidth: 2,
    borderColor: theme.fieldBorder,
    justifyContent: "center",
    alignItems: "center",
    padding: 4 * scale,
  },

  fila: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    flex: 1,
    width: "100%",
  },

  red: {
  width: 6 * scale,               // 👉 más gruesa para consistencia
  alignSelf: "stretch",
  backgroundColor: "#000",
  marginHorizontal: 6 * scale,    // 👉 más separación entre los lados
  borderRadius: 2 * scale,        // 👉 bordes redondeados para un look más limpio
  elevation: 3,                   // 👉 pequeña sombra en Android
  shadowColor: "#000",            // 👉 pequeña sombra en iOS
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 1.5,
},

columna: {
  flex: 1,
  justifyContent: "space-evenly",
  alignItems: "center",
  paddingHorizontal: 4 * scale,   // 👉 un poquito más de aire
},


  posicion: {
    width: posicionSize,
    height: posicionSize,
    marginVertical: 2 * scale,
    borderWidth: 2,
    borderColor: theme.fieldBorder,
    borderRadius: 8 * scale,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
    paddingVertical: 4 * scale,
  },

  posLabel: {
    fontSize: posicionSize * 0.16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2 * scale,
    marginTop: -2 * scale,
  },

  divisor: {
    width: "80%",
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 2,
  },

  numLabel: {
    fontSize: posicionSize * 0.32,
    fontWeight: "900",
    color: "#111",
    marginTop: 2,
    flex: 1,
    textAlignVertical: "center",
  },

  homeButton: {
    position: "absolute",
    left: width * 0.1 * scale,
    top: height * 0.015 * scale,
    zIndex: 20,
    padding: campoSize * 0.018,
    backgroundColor: "#fb923c",
    borderRadius: campoSize * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  modoButton: {
    position: "absolute",
    top: height * 0.015 * scale,
    right: width * 0.1 * scale,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fb923c",
    paddingHorizontal: width * 0.025 * scale,
    paddingVertical: height * 0.008 * scale,
    borderRadius: 10 * scale,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  modoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12 * scale * smallFactor,
  },

  filaSets: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: campoSize,
    height: 40 * scale,
    backgroundColor: "#fff",
    borderRadius: 8 * scale,
    elevation: 2,
    paddingHorizontal: 4 * scale,
    marginBottom: 25 * scale,
  },

  setButton: {
    width: 30 * scale,
    height: 30 * scale,
    borderRadius: 6 * scale,
    backgroundColor: theme.buttonSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  setDisplay: {
    flex: 1,
    height: "85%",
    marginHorizontal: 4 * scale,
    borderRadius: 6 * scale,
    backgroundColor: theme.buttonSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  setText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14 * scale,
    textAlign: "center",
  },

  backgroundLogo: {
    position: "absolute",
    width: campoSize * 0.6,
    height: campoSize * 0.22,
    opacity: 0.16,
    zIndex: 0,
    resizeMode: "contain",
    left: (campoSize - campoSize * 0.6) / 2,
    top: (60 * scale + 25 * scale - campoSize * 0.22) / 2,
    pointerEvents: "none",
  },

  qrButton: {
    flex: 1,
    backgroundColor: theme.buttonSecondary,
    paddingVertical: 10 * scale,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10 * scale,
    flexDirection: "column",
    elevation: 4,
  },

  qrRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
  },

  swipeNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    height: 50 * scale,
  },

  qrButtonLeft: {
    marginRight: 4 * scale,
  },

  qrButtonRight: {
    marginLeft: 4 * scale,
  },

  qrButtonText: {
    color: "#fff",
    fontSize: 12 * scale,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },

  qrIcon: {
    width: 24 * scale,
    height: 24 * scale,
    tintColor: "#fff",
    marginBottom: 4 * scale,
  },
});
