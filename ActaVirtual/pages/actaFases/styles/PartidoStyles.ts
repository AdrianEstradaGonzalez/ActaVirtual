import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../../config/themes";

const { width, height } = Dimensions.get("window");

// Escala responsiva
const BASE_WIDTH = 360;
const BASE_HEIGHT = 640;
const rawScale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

const MIN_SCALE = 0.8;
const MAX_SCALE = 1.2;
let scale = Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);

const isSmallScreen = width < 360;
const isTablet = width >= 700 || height >= 1000;
const bigFactor = isTablet ? 0.85 : 1;

scale = scale * bigFactor;

const HORIZONTAL_PADDING = 12; // debe coincidir con contentContainer.paddingHorizontal
const maxAvailableWidth = Math.max(0, width - HORIZONTAL_PADDING * 2);
const computedCampo = width * 0.88 * scale;
const campoSize = Math.min(computedCampo, maxAvailableWidth);
const posicionSize = (campoSize - 32) / 4;

export const createPartidoStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    paddingTop: 4,
    paddingBottom: 2,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
    paddingHorizontal: 12,
  },

  // ===== BOTÓN DESHACER =====
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    paddingVertical: 8 * scale,
    paddingHorizontal: 16 * scale,
    borderRadius: 8 * scale,
    marginBottom: 8 * scale,
    width: "100%",
    maxWidth: campoSize,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  undoButtonDisabled: {
    backgroundColor: "#e5e7eb",
    elevation: 0,
  },

  undoButtonText: {
    color: "#fff",
    fontSize: 14 * scale,
    fontWeight: "700",
    marginLeft: 8 * scale,
  },

  undoButtonTextDisabled: {
    color: "#9ca3af",
  },

  // ===== MARCADOR =====
  scoreboardContainer: {
    width: "100%",
    maxWidth: campoSize,
    marginBottom: 4 * scale,
    backgroundColor: "#1f2937",
    borderRadius: 12 * scale,
    padding: 8 * scale,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  scoreboardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6 * scale,
  },

  setsIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * scale,
  },

  setCircle: {
    width: 14 * scale,
    height: 14 * scale,
    borderRadius: 7 * scale,
    borderWidth: 2,
    borderColor: theme.primaryLight,
    backgroundColor: "transparent",
  },

  setCircleFilled: {
    backgroundColor: theme.primaryLight,
  },

  setIndicator: {
    backgroundColor: theme.primaryLight,
    paddingHorizontal: 12 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 6 * scale,
  },

  setIndicatorText: {
    color: "#fff",
    fontSize: 13 * scale,
    fontWeight: "700",
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teamScore: {
    flex: 1,
    alignItems: "center",
  },

  teamNameScore: {
    color: "#d1d5db",
    fontSize: 16 * scale,
    fontWeight: "600",
    marginBottom: 4 * scale,
  },

  scoreValue: {
    color: "#fff",
    fontSize: 36 * scale,
    fontWeight: "900",
  },

  scoreDivider: {
    color: "#6b7280",
    fontSize: 30 * scale,
    fontWeight: "700",
    marginHorizontal: 8 * scale,
  },

  // ===== CAMPO =====
  campoWrapper: {
    marginBottom: 8 * scale,
    position: "relative",
  },

  // ===== TIMER DE TIMEOUT =====
  timeoutContainer: {
    width: campoSize,
    aspectRatio: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16 * scale,
    borderWidth: 3,
    borderColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    padding: 20 * scale,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  timeoutTitle: {
    fontSize: 24 * scale,
    fontWeight: "900",
    color: "#f59e0b",
    marginTop: 16 * scale,
    marginBottom: 8 * scale,
    letterSpacing: 1,
  },

  timeoutEquipo: {
    fontSize: 18 * scale,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16 * scale,
  },

  timeoutTimer: {
    fontSize: 72 * scale,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 24 * scale,
  },

  timeoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12 * scale,
    paddingHorizontal: 32 * scale,
    borderRadius: 8 * scale,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  timeoutButtonText: {
    color: "#fff",
    fontSize: 16 * scale,
    fontWeight: "700",
  },

  teamLabel: {
    position: "absolute",
    top: -16 * scale,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  teamLabelLeft: {
    left: 12,
  },

  teamLabelRight: {
    right: 12,
  },

  teamNameLabel: {
    fontSize: 14 * scale,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fde047",
    paddingHorizontal: 10 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 8 * scale,
    borderWidth: 1,
    borderColor: "#d97706",
  },

  teamCodeLabel: {
    fontSize: 14 * scale,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fff176",
    paddingHorizontal: 8 * scale,
    paddingVertical: 3 * scale,
    borderRadius: 6 * scale,
    borderWidth: 1,
    borderColor: "#d97706",
    minWidth: 40,
    textAlign: "center",
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
    width: 6 * scale,
    alignSelf: "stretch",
    backgroundColor: "#000",
    marginHorizontal: 6 * scale,
    borderRadius: 2 * scale,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
  },

  columna: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 4 * scale,
  },

  posicionWrapper: {
    position: "relative",
    marginVertical: 2 * scale,
  },

  posicion: {
    width: posicionSize,
    height: posicionSize,
    borderWidth: 2,
    borderColor: theme.fieldBorder,
    borderRadius: 8 * scale,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
    paddingVertical: 4 * scale,
  },

  posicionTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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

  capitanBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: theme.primary,
    width: 18 * scale,
    height: 18 * scale,
    borderRadius: 9 * scale,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    elevation: 3,
    zIndex: 10,
  },

  capitanText: {
    color: "#fff",
    fontSize: 10 * scale,
    fontWeight: "900",
  },

  serverBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    zIndex: 10,
  },

  // ===== BOTONES QR =====
  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: campoSize,
    marginTop: 8 * scale,
    marginBottom: 12 * scale,
  },

  qrButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    paddingVertical: 10 * scale,
    paddingHorizontal: 8 * scale,
    borderRadius: 10 * scale,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  qrButtonLeft: {
    marginRight: 6 * scale,
  },

  qrButtonRight: {
    marginLeft: 6 * scale,
  },

  qrIcon: {
    width: 20 * scale,
    height: 20 * scale,
    tintColor: "#fff",
    marginRight: 6 * scale,
  },

  qrButtonText: {
    color: "#fff",
    fontSize: 11 * scale,
    fontWeight: "700",
    textAlign: "center",
  },

  // ===== BANQUILLO =====
  banquilloSection: {
    width: "100%",
    maxWidth: campoSize,
    marginBottom: 12 * scale,
  },

  banquilloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  banquilloTeam: {
    flex: 1,
  },

  banquilloLeft: {
    marginRight: 6 * scale,
  },

  banquilloRight: {
    marginLeft: 6 * scale,
  },

  banquilloHeader: {
    backgroundColor: theme.secondary,
    paddingVertical: 6 * scale,
    paddingHorizontal: 8 * scale,
    borderTopLeftRadius: 8 * scale,
    borderTopRightRadius: 8 * scale,
  },

  banquilloHeaderText: {
    color: "#fff",
    fontSize: 12 * scale,
    fontWeight: "700",
    textAlign: "center",
  },

  banquilloContent: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#d1d5db",
    borderBottomLeftRadius: 8 * scale,
    borderBottomRightRadius: 8 * scale,
    padding: 6 * scale,
    minHeight: 60 * scale,
  },

  banquilloJugadores: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  jugadorBanquillo: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 6 * scale,
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    margin: 3 * scale,
    minWidth: 36 * scale,
    alignItems: "center",
    justifyContent: "center",
  },

  jugadorBanquilloText: {
    fontSize: 13 * scale,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },

  staffBanquillo: {
    backgroundColor: "#fef3c7",
    borderWidth: 2,
    borderColor: "#f59e0b",
  },

  staffBanquilloItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6 * scale,
    paddingHorizontal: 8 * scale,
    marginBottom: 4 * scale,
    backgroundColor: "#f3f4f6",
    borderRadius: 4 * scale,
    borderLeftWidth: 3 * scale,
    borderLeftColor: theme.primary,
    gap: 8 * scale,
  },

  staffBanquilloCodigo: {
    fontSize: 11 * scale,
    fontWeight: "700",
    color: theme.primary,
    minWidth: 24 * scale,
  },

  staffBanquilloText: {
    fontSize: 11 * scale,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },

  banquilloSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 8 * scale,
  },

  // ===== CONTROLES =====
  controlesSection: {
    width: "100%",
    maxWidth: campoSize,
    marginBottom: 12 * scale,
  },

  controlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  controlesEquipo: {
    flex: 1,
    marginHorizontal: 3 * scale,
  },

  controlBox: {
    backgroundColor: "#fff",
    borderRadius: 10 * scale,
    paddingVertical: 10 * scale,
    paddingHorizontal: 12 * scale,
    marginBottom: 8 * scale,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    minHeight: 68 * scale,
    justifyContent: "space-between",
  },

  controlIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6 * scale,
    marginBottom: 8 * scale,
  },

  controlTitle: {
    fontSize: 11 * scale,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  controlValue: {
    fontSize: 22 * scale,
    fontWeight: "900",
    color: theme.primary,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // ===== MODAL =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },

  modalButtonPrimary: {
    backgroundColor: theme.primary,
  },

  modalButtonSecondary: {
    backgroundColor: "#6b7280",
  },

  modalButtonDanger: {
    backgroundColor: "#dc2626",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  modalList: {
    maxHeight: 300,
  },

  modalListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  modalListItemText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },

  amonestacionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },

  amonestacionButton: {
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 2,
  },

  amarillaButton: {
    backgroundColor: "#fef3c7",
    borderColor: "#fbbf24",
  },

  rojaButton: {
    backgroundColor: "#fee2e2",
    borderColor: "#dc2626",
  },

  amonestacionButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  amarillaText: {
    color: "#92400e",
  },

  rojaText: {
    color: "#991b1b",
  },

  // ===== BOTÓN SWAP =====
  swapButtonContainer: {
    position: "absolute",
    top: -18,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
  },

  swapButton: {
    backgroundColor: "#facc15",
    padding: 6 * scale,
    borderRadius: 30 * scale,
    borderWidth: 1,
    borderColor: "#d97706",
  },

  swapIcon: {
    width: 24 * scale,
    height: 24 * scale,
    tintColor: "#000",
  },

  // ===== SCANNER QR =====
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  scannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  scannerFrame: {
    width: 250,
    height: 250,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },

  scannerCancelButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.primaryDark || "#f59e0b",
    borderRadius: 8,
  },

  scannerCancelText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
