// QRView.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../types/Navigation";
import { createQRViewStyles } from "../styles/QRViewStyles";
import { useCommunity } from "../context/CommunityContext";

const { width, height } = Dimensions.get("window");

// Iconos locales
const icons = {
  back: require("../assets/icons/left.png"),
};

type QRViewRouteProp = RouteProp<RootStackParamList, "QRView">;

export default function QRView() {
  const { theme } = useCommunity();
  const route = useRoute<QRViewRouteProp>();
  const navigation = useNavigation();
  const { data } = route.params;

  if (!theme) return null;
  
  const styles = createQRViewStyles(theme);

  // Tamaño adaptativo del QR
  const qrSize = Math.min(width * 0.7, height * 0.4); // nunca más grande que el 70% ancho o 40% alto

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Código QR generado</Text>
      <QRCode value={data} size={qrSize} />
      <Text style={styles.subtitle}>Muestra este código al árbitro</Text>

      {/* Botón Volver con icono local */}
      <TouchableOpacity
        style={styles.volverButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={icons.back}
          style={{ width: qrSize * 0.08, height: qrSize * 0.08, tintColor: "#fff", marginRight: 6 }}
        />
        <Text style={[styles.volverButtonText, { fontSize: Math.min(width * 0.045, 18) }]}>
          Volver
        </Text>
      </TouchableOpacity>
    </View>
  );
}
