import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Theme } from '../config/themes';
import { CommunityAssets } from '../config/assets';

interface CustomAlertProps {
  visible: boolean;
  theme: Theme;
  assets: CommunityAssets;
  message: string;
  onReset?: () => void;
  onCancel: () => void;
  onAccept: () => void;
  showResetButton?: boolean;
}

export default function CustomAlert({
  visible,
  theme,
  assets,
  message,
  onReset,
  onCancel,
  onAccept,
  showResetButton = true,
}: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Header compacto */}
          <View style={styles.header}>
            {/* Bandera en círculo pequeño arriba a la izquierda */}
            <View style={styles.flagCircle}>
              <Image
                source={assets.flag}
                style={styles.flag}
                resizeMode="cover"
              />
            </View>
            
            {/* Título de la federación */}
            <Text style={[styles.headerTitle, { color: theme.primaryDark }]}>
              {theme.federationTitle}
            </Text>
          </View>

          {/* Mensaje */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {/* Reiniciar rotaciones - Solo si showResetButton es true */}
            {showResetButton && onReset && (
              <TouchableOpacity
                style={styles.button}
                onPress={onReset}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>
                  Reiniciar rotaciones
                </Text>
              </TouchableOpacity>
            )}

            {/* Cancelar */}
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, styles.buttonOutlineText]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            {/* Aceptar */}
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { backgroundColor: theme.primaryDark }]}
              onPress={onAccept}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.buttonPrimaryText]}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    position: 'relative',
  },
  flagCircle: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 2,
  },
  message: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    color: '#374151',
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  buttonPrimary: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  buttonOutlineText: {
    color: '#6b7280',
  },
  buttonPrimaryText: {
    color: '#ffffff',
  },
});
