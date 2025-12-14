import { View, ImageBackground, Image, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, Provider as PaperProvider, Card } from "react-native-paper";
import EntrenadorView from "./pages/EntrenadorView";
import QRView from "./pages/QRView";
import ArbitroPager from "./pages/ArbitroPager";
import { CommunityProvider, useCommunity } from "./context/CommunityContext";
import { CommunitySelector } from "./pages/CommunitySelector";
import { CommunitySwitcher } from "./components/CommunitySwitcher";
import { createAppStyles } from "./styles/AppStyles";
import { useState, useEffect } from "react";
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { height: screenHeight } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  Entrenador: undefined;
  Arbitro: undefined;
  QRView: { data: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: any) {
  const { theme, assets, communityId, clearCommunity } = useCommunity();
  const [showSelector, setShowSelector] = useState(false);

  if (!theme || !assets || !communityId) {
    return null; // o un loading spinner
  }

  const AppStyles = createAppStyles(theme);

  const handleChangeCommunity = async () => {
    await clearCommunity();
    setShowSelector(true);
  };

  if (showSelector) {
    return <CommunitySelector onSelect={() => setShowSelector(false)} />;
  }

  // Renderizado específico para Baleares
  if (communityId === 'baleares') {
    return (
      <ImageBackground
        source={assets.background}
        style={AppStyles.background}
      >
        {/* Botón para cambiar comunidad */}
        <CommunitySwitcher onPress={handleChangeCommunity} />

        <View style={AppStyles.overlay}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: screenHeight * 0.15 }}>
            {/* Sección 1: Logo Header */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Image
                source={assets.headerLogo}
                style={AppStyles.logoHeader}
                resizeMode="contain"
              />
            </View>

            {/* Sección 2: Contenedor Principal */}
            <Card style={AppStyles.card} mode="elevated">
            <Card.Content style={AppStyles.cardContent}>
              {/* Logos horizontalmente centrados */}
              <View style={AppStyles.logosRow}>
                <Image
                  source={assets.appLogo}
                  style={AppStyles.secondaryLogo}
                  resizeMode="contain"
                />
                {assets.topRightLogo && (
                  <Image
                    source={assets.topRightLogo}
                    style={AppStyles.balearesSecondaryLogo}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text variant="headlineLarge" style={AppStyles.title}>
                {assets.appTitle}
              </Text>

              {/* Botones de acción */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate("Entrenador")}
                style={AppStyles.actionCard}
              >
                <View style={AppStyles.actionLeftBar} />
                <View style={AppStyles.actionBorder} pointerEvents="none" />
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={AppStyles.actionText}>Entrenador</Text>
                </View>
                <Text style={AppStyles.actionArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate("Arbitro")}
                style={AppStyles.actionCard}
              >
                <View style={AppStyles.actionLeftBar} />
                <View style={AppStyles.actionBorder} pointerEvents="none" />
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={AppStyles.actionText}>Árbitro</Text>
                </View>
                <Text style={AppStyles.actionArrow}>›</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

            {/* Sección 3: Logo Footer (Patrocinador) */}
            <View style={{ height: 80, marginTop: 12, alignItems: 'center', justifyContent: 'center' }}>
              {assets.sponsorLogo && (
                <Image
                  source={assets.sponsorLogo}
                  style={AppStyles.sponsorLogo}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>

          <Text style={AppStyles.copyright}>
            © Copyright 2025 - BlueDeBug
          </Text>
        </View>
      </ImageBackground>
    );
  }

  // Renderizado para Asturias (y otras comunidades genéricas)
  return (
    <ImageBackground
      source={assets.background}
      style={AppStyles.background}
    >
      {/* Botón para cambiar comunidad */}
      <CommunitySwitcher onPress={handleChangeCommunity} />

      <View style={AppStyles.overlay}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: screenHeight * 0.15 }}>
          {/* Sección 1: Logo Header */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={assets.headerLogo}
              style={AppStyles.logoHeader}
              resizeMode="contain"
            />
          </View>

          {/* Sección 2: Contenedor Principal */}
          <Card style={AppStyles.card} mode="elevated">
          <Card.Content style={AppStyles.cardContent}>
            {/* Logos horizontalmente centrados */}
            <View style={AppStyles.logosRow}>
              <Image
                source={assets.appLogo}
                style={AppStyles.secondaryLogo}
                resizeMode="contain"
              />
              <Image
                source={assets.appLogoWithLetters}
                style={AppStyles.secondaryLogo}
                resizeMode="contain"
              />
            </View>
            <Text variant="headlineLarge" style={AppStyles.title}>
              {assets.appTitle}
            </Text>

            {/* Botones con estilo tipo "liga" */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Entrenador")}
              style={AppStyles.actionCard}
            >
              <View style={AppStyles.actionLeftBar} />
              <View style={AppStyles.actionBorder} pointerEvents="none" />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={AppStyles.actionText}>Entrenador</Text>
              </View>
              <Text style={AppStyles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Arbitro")}
              style={AppStyles.actionCard}
            >
              <View style={AppStyles.actionLeftBar} />
              <View style={AppStyles.actionBorder} pointerEvents="none" />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={AppStyles.actionText}>Árbitro</Text>
              </View>
              <Text style={AppStyles.actionArrow}>›</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

          {/* Sección 3: Logo Footer (Espacio reservado, sin contenido en Asturias) */}
          <View style={{ height: 80, marginTop: 12, alignItems: 'center', justifyContent: 'center' }}>
            {/* Espacio reservado para mantener consistencia con Baleares */}
          </View>
        </View>

        {/* Marca de CopyRight */}
        <Text style={AppStyles.copyright}>
          © Copyright 2025 - BlueDeBug
        </Text>
      </View>
    </ImageBackground>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <CommunityProvider>
        <AppContent />
      </CommunityProvider>
    </PaperProvider>
  );
}

function AppContent() {
  const { communityId, isLoading } = useCommunity();

  // Solicitar permisos de cámara al iniciar la app
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA;
        
        const result = await request(permission);
        
        if (result !== RESULTS.GRANTED) {
          console.log('Permiso de cámara no concedido:', result);
        }
      } catch (error) {
        console.error('Error solicitando permiso de cámara:', error);
      }
    };

    requestCameraPermission();
  }, []);

  // Mostrar loading mientras se carga la comunidad guardada
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Cargando...</Text>
      </View>
    );
  }

  // Si no hay comunidad seleccionada, mostrar selector
  if (!communityId) {
    return <CommunitySelector />;
  }

  // Si ya hay comunidad, mostrar navegación normal
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Entrenador"
          component={EntrenadorView}
          options={{ title: "Modo Entrenador" }}
        />
        <Stack.Screen
          name="Arbitro"
          component={ArbitroPager}
          options={{ title: "Modo Arbitro" }}
        />
        <Stack.Screen
          name="QRView"
          component={QRView}
          options={{ title: "Código QR" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}