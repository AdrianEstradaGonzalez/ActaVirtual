/**
 * 🏁 COMMUNITY SELECTOR SCREEN
 * ============================
 * Pantalla inicial para seleccionar la comunidad autónoma.
 * Muestra las banderas de las comunidades disponibles.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useCommunity } from '../context/CommunityContext';
import { CommunityId, THEMES } from '../config/themes';

const { width, height } = Dimensions.get('window');

interface CommunitySelectorProps {
  onSelect?: () => void;
}

export const CommunitySelector: React.FC<CommunitySelectorProps> = ({ onSelect }) => {
  const { setCommunity } = useCommunity();

  const handleSelect = async (communityId: CommunityId) => {
    await setCommunity(communityId);
    onSelect?.();
  };

  return (
    <ImageBackground
      source={require('../assets/fondo.jpeg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Título */}
          <Text style={styles.title}>Selecciona tu Comunidad</Text>
          <Text style={styles.subtitle}>
            Elige tu comunidad autónoma para personalizar la aplicación
          </Text>

          {/* Contenedor de banderas */}
          <View style={styles.flagsContainer}>
            {/* ASTURIAS */}
            <TouchableOpacity
              style={styles.flagCard}
              activeOpacity={0.8}
              onPress={() => handleSelect('asturias')}
            >
              <View style={styles.flagImageContainer}>
                <Image
                  source={require('../assets/asturias/bandera.png')}
                  style={styles.flagImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.flagTextContainer}>
                <Text style={styles.flagName}>{THEMES.asturias.name}</Text>
                <Text style={styles.flagSubtext}>FVBPA LINE UP</Text>
              </View>
            </TouchableOpacity>

            {/* BALEARES */}
            <TouchableOpacity
              style={styles.flagCard}
              activeOpacity={0.8}
              onPress={() => handleSelect('baleares')}
            >
              <View style={styles.flagImageContainer}>
                <Image
                  source={require('../assets/baleares/bandera.png')}
                  style={styles.flagImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.flagTextContainer}>
                <Text style={styles.flagName}>{THEMES.baleares.name}</Text>
                <Text style={styles.flagSubtext}>COTABAL LINE UP</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info adicional */}
          <Text style={styles.footerText}>
            Puedes cambiar tu selección en cualquier momento desde la configuración
          </Text>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © Copyright 2025 - BlueDeBug
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  flagsContainer: {
    width: '100%',
    gap: 20,
  },
  flagCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  flagImageContainer: {
    width: 100,
    height: 70,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  flagTextContainer: {
    flex: 1,
  },
  flagName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  flagSubtext: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  copyright: {
    position: 'absolute',
    bottom: 30,
    fontSize: 11,
    color: '#e2e8f0',
    opacity: 0.85,
    letterSpacing: 0.5,
  },
});
