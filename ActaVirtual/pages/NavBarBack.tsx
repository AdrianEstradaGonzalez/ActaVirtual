import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCommunity } from "../context/CommunityContext";

type NavBarBackProps = {
  onBack: () => void;
  isLeft: boolean; // true si la flecha debe estar a la izquierda
};

export default function NavBarBack({ onBack, isLeft }: NavBarBackProps) {
  const insets = useSafeAreaInsets();
  const { theme, assets, communityId } = useCommunity();
  
  const icons = {
    back: require("../assets/icons/left.png"),
  };

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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between",
      }}
    >
      {isLeft && (
        <TouchableOpacity onPress={onBack}>
          <Image
            source={icons.back}
            style={{
              width: 28,
              height: 28,
              tintColor: "#fff",
            }}
          />
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
          <Image
            source={icons.back}
            style={{
              width: 28,
              height: 28,
              tintColor: "#fff",
              transform: [{ scaleX: -1 }],
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
