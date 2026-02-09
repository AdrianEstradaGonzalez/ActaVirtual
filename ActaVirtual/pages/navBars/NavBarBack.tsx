import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import VectorIcon from "../../components/VectorIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCommunity } from "../../context/CommunityContext";

type NavBarBackProps = {
  onBack: () => void;
  isLeft?: boolean; // true si la flecha debe estar a la izquierda
  title?: string;
  onMenuPress?: () => void; // función para abrir el drawer
  showObservaciones?: boolean; // mostrar botón de observaciones
  onObservacionesPress?: () => void; // función para abrir observaciones
};

export default function NavBarBack({ onBack, isLeft = true, title, onMenuPress, showObservaciones = false, onObservacionesPress }: NavBarBackProps) {
  const insets = useSafeAreaInsets();
  const { theme, assets, communityId } = useCommunity();
  
  // using VectorIcon for the back/logout icon

  if (!theme || !assets) return null;

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: insets.top + 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: theme.primaryDark,
        shadowColor: "#770a0aff",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between",
      }}
    >
      {/* Lado izquierdo - Menú */}
      {isLeft && (
        <TouchableOpacity onPress={onMenuPress || onBack}>
          <VectorIcon name={onMenuPress ? "menu" : "close"} size={28} color="#fff" />
        </TouchableOpacity>
      )}
      
      {/* Lado derecho - Observaciones (opcional) + Bandera */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Botón de observaciones (solo visible en fase de partido) */}
        {showObservaciones && onObservacionesPress && (
          <TouchableOpacity 
            onPress={onObservacionesPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              gap: 6,
            }}
          >
            <VectorIcon name="note-outline" size={16} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "500" }}>Observaciones</Text>
          </TouchableOpacity>
        )}
        
        {/* Logo condicional para Baleares y Asturias */}
        {(communityId === 'baleares' || communityId === 'asturias') && isLeft && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              overflow: "hidden",
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={assets.flag}
              style={{
                width: 28,
                height: 28,
                resizeMode: "cover",
              }}
            />
          </View>
        )}
      </View>

      {(communityId === 'baleares' || communityId === 'asturias') && !isLeft && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            overflow: "hidden",
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={assets.flag}
            style={{
              width: 28,
              height: 28,
              resizeMode: "cover",
            }}
          />
        </View>
      )}
      
      {!isLeft && (
        <TouchableOpacity onPress={onBack}>
          <VectorIcon name="close" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      {title && (
        <Text
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
      )}
    </View>
  );
}
