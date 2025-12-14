import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCommunity } from "../context/CommunityContext";
import CustomAlert from "../components/CustomAlert";

type NavBarProps = {
  modo: "6x6" | "4x4";
  toggleModo: () => void;
  valoresEquipos?: {
    [set: number]: {
      A?: { [pos: string]: string };
      B?: { [pos: string]: string };
    };
  };
  onClearRotations?: () => void;
  showResetButton?: boolean;
  alertMessage?: string;
};

export default function NavBar({ modo, toggleModo, valoresEquipos, onClearRotations, showResetButton = true, alertMessage }: NavBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { theme, assets } = useCommunity();
  const [showAlert, setShowAlert] = useState(false);

  const icons = {
    home: require("../assets/icons/home.png"),
    swap: require("../assets/icons/swap.png"),
  };

  if (!theme || !assets) return null;

  // Verificar si hay alguna alineación guardada
  const hasAlineaciones = () => {
    if (!valoresEquipos) return false;
    
    return Object.values(valoresEquipos).some(set => {
      const equipoA = set.A || {};
      const equipoB = set.B || {};
      
      // Verificar si hay valores no vacíos en las posiciones (excluyendo 'codigo' y 'equipo')
      const hasValuesA = Object.entries(equipoA).some(([key, value]) => 
        key !== 'codigo' && key !== 'equipo' && value && value.toString().trim() !== ''
      );
      const hasValuesB = Object.entries(equipoB).some(([key, value]) => 
        key !== 'codigo' && key !== 'equipo' && value && value.toString().trim() !== ''
      );
      
      return hasValuesA || hasValuesB;
    });
  };

  const handleHomePress = () => {
    if (hasAlineaciones()) {
      setShowAlert(true);
    } else {
      navigation.navigate("Home");
    }
  };

  const handleReset = () => {
    if (onClearRotations) {
      onClearRotations();
    }
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleAccept = () => {
    if (onClearRotations) {
      onClearRotations();
    }
    setShowAlert(false);
    navigation.navigate("Home");
  };

  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: insets.top + 10,
          paddingBottom: 10,
          backgroundColor: theme.primaryDark,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        {/* Botón Home */}
        <TouchableOpacity onPress={handleHomePress}>
          <Image
            source={icons.home}
            style={{ width: 28, height: 28, tintColor: "#fff" }}
          />
        </TouchableOpacity>

        {/* Botón Modo (icono + texto juntos) */}
        <TouchableOpacity
          onPress={toggleModo}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 5 }}>
            {modo === "6x6" ? "VOLEIBOL 6x6" : "MINIVOLEY 4x4"}
          </Text>
          <Image
            source={icons.swap}
            style={{ width: 22, height: 22, tintColor: "#fff", marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={showAlert}
        theme={theme}
        assets={assets}
        message={alertMessage || "¿Está seguro de que quiere salir? Se perderán las rotaciones."}
        onReset={handleReset}
        onCancel={handleCancel}
        onAccept={handleAccept}
        showResetButton={showResetButton}
      />
    </>
  );
}
