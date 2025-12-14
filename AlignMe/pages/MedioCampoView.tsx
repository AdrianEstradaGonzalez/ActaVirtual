import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { createMedioCampoStyles } from "../styles/MedioCampoStyles";
import { useCommunity } from "../context/CommunityContext";
import SwipeIndicatorNav from "./SwipeIndicatorNav";
import NavBarBack from "./NavBarBack";

// Icono local
const icons = {
  qr: require("../assets/icons/qr.png"),
};

const posiciones6x6 = { delanteras: ["IV", "III", "II"], traseras: ["V", "VI", "I"] };
const posiciones4x4 = { delanteras: ["IV", "III", "II"], traseras: ["I"] };


const { width } = Dimensions.get("window");

export default function MedioCampoView({
  modo,
  lado,
  setActual,
  onEscanear,
  valoresQR = {},
  scrollRef,
  swapLados = false,
}: {
  modo: "6x6" | "4x4";
  lado: "izq" | "der";
  setActual: number;
  onEscanear: (eq: "A" | "B") => void;
  valoresQR?: { codigo?: string; equipo?: string } & { [pos: string]: string };
  scrollRef: React.RefObject<ScrollView | null>;
  swapLados?: boolean;
}) {
  const { theme } = useCommunity();
  const posiciones = modo === "6x6" ? posiciones6x6 : posiciones4x4;

  if (!theme) return null;
  
  const styles = createMedioCampoStyles(theme);

  let equipo: "A" | "B" =
    lado === "izq"
      ? setActual % 2 === 1
        ? "A"
        : "B"
      : setActual % 2 === 1
      ? "B"
      : "A";
  if ((modo === "6x6" && setActual === 5) || (modo === "4x4" && setActual === 3)) {
  if (swapLados) {
    equipo = equipo === "A" ? "B" : "A";
  }
}


  const renderPosicion = (pos: string) => (
    <View key={pos} style={styles.posicion}>
      <Text style={styles.label}>{pos}</Text>
      <Text style={styles.input}>
        {valoresQR[pos] ?? "-"}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafc" }}>
      {/* 🔹 Barra superior con flecha */}
      <NavBarBack
        onBack={() => scrollRef.current?.scrollTo({ x: width, animated: true })}
        isLeft={lado === "der"} // flecha hacia izquierda si estamos en el lado derecho
      />

      {/* Contenido scrollable */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <View style={styles.tituloBox}>
          <Text style={styles.tituloPrincipal}>HOJA DE ROTACIONES</Text>
          <Text style={styles.tituloSecundario}>SET {setActual}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          {lado === "izq" && (
            <View style={[styles.labelEquipo, { left: 12 }]}>
              <Text style={styles.textoEquipo}>{equipo}</Text>
            </View>
          )}
          {lado === "der" && (
            <View style={[styles.labelEquipo, { right: 12 }]}>
              <Text style={styles.textoEquipo}>{equipo}</Text>
            </View>
          )}
          {lado === "izq" && (
            <View style={[styles.labelCodigo, { right: 12 }]}>
              <Text style={styles.textoCodigo}>{valoresQR.codigo?.toUpperCase() ?? "---"}</Text>
            </View>
          )}
          {lado === "der" && (
            <View style={[styles.labelCodigo, { left: 12 }]}>
              <Text style={styles.textoCodigo}>{valoresQR.codigo?.toUpperCase() ?? "---"}</Text>
            </View>
          )}

          <View style={styles.campo}>
            <View style={styles.fila}>
              {posiciones.delanteras.map((pos) => renderPosicion(pos))}
            </View>
            <View style={styles.lineaSeparadora} />
            <View style={styles.fila}>
              {modo === "6x6" ? (
                posiciones.traseras.map((pos) => renderPosicion(pos))
              ) : (
                <View style={styles.filaUnica}>{renderPosicion("I")}</View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Botón QR fijo encima del footer */}
      <View style={{ paddingHorizontal: 16, marginBottom: 100 }}>
        <TouchableOpacity
          style={[styles.qrButton, { flexDirection: "column", alignItems: "center" }]}
          onPress={() => onEscanear(equipo)}
        >
          <Image
            source={icons.qr}
            style={{ width: 32, height: 32, tintColor: "#fff", marginBottom: 6 }}
          />
          <Text style={styles.qrButtonText}>{`ESCANEAR\nEQUIPO ${equipo}`}</Text>
        </TouchableOpacity>
      </View>

      {/* SwipeIndicatorNav fijo como footer */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <SwipeIndicatorNav active={lado === "izq" ? "left" : "right"} />
      </View>
    </View>
  );
}
