import { View, Image } from "react-native";
import { useCommunity } from "../context/CommunityContext";

const icons = {
  home: require("../assets/icons/home.png"), // la casita que ya usas
};

type Props = {
  active: "left" | "center" | "right"; // dónde está el usuario
};

export default function SwipeIndicatorNav({ active }: Props) {
  const { theme } = useCommunity();
  
  if (!theme) return null;
  
  return (
    <View
      style={{
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
      }}
      pointerEvents="none"
    >
      {/* Punto izquierda */}
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: active === "left" ? theme.primary : "#d1d5db",
          opacity: active === "left" ? 1 : 0.4,
        }}
      />

      {/* Casita centro */}
      <Image
        source={icons.home}
        style={{
          width: 18,
          height: 18,
          tintColor: active === "center" ? theme.primary : "#9ca3af",
          opacity: active === "center" ? 1 : 0.5,
        }}
      />

      {/* Punto derecha */}
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: active === "right" ? theme.primary : "#d1d5db",
          opacity: active === "right" ? 1 : 0.4,
        }}
      />
    </View>
  );
}
