import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunity } from '../context/CommunityContext';
import CustomAlert from './CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VectorIcon from './VectorIcon';

interface DrawerMenuProps {
  navigation: any;
  onClose: () => void;
}

export default function DrawerMenu({ navigation, onClose }: DrawerMenuProps) {
  const { theme, assets } = useCommunity();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [userName] = useState('Juan Pérez'); // TODO: obtener del contexto/storage

  if (!theme || !assets) return null;

  const handleLogout = () => {
    // Mostrar alert SIN cerrar el drawer todavía
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    (async () => {
      try {
        setShowLogoutAlert(false);
        onClose(); // Cerrar drawer
        // Clear AsyncStorage (session tokens etc.)
        await AsyncStorage.clear();
      } catch (e) {
        console.error('Error clearing storage on logout:', e);
      } finally {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    })();
  };

  const MenuItem = ({ 
    icon, 
    label, 
    onPress, 
    iconColor = '#ffffff',
  }: { 
    icon: string; 
    label: string; 
    onPress: () => void; 
    iconColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.iconContainer}>
          <VectorIcon name={icon} size={24} color={iconColor} />
        </View>
        <Text style={styles.menuItemText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryDark }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header con info del usuario */}
        <View style={[styles.header, { borderBottomColor: theme.primary + '40' }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={styles.userSubtitle} numberOfLines={1}>
            Árbitro
          </Text>
        </View>

        {/* Scrollable menu */}
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
            <View style={styles.menuContainer}>
              <MenuItem
                icon="notebook"
                label="Mis Designaciones"
                onPress={() => {
                  onClose();
                  // Ya estamos en Designaciones
                }}
                iconColor="#fdfdfdff"
              />

              {/* Divisor */}
              <View style={[styles.divider, { backgroundColor: theme.primary + '30' }]} />

              {/* Logout button */}
              {/* Logout will be rendered at bottom */}
            </View>
          </ScrollView>
        </View>

        {/* Logout at bottom */}
        <View style={styles.bottomLogout}>
          <MenuItem
            icon="logout"
            label="Cerrar Sesión"
            onPress={handleLogout}
            iconColor="#f87171"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Acta Virtual</Text>
          <Text style={styles.footerVersion}>BlueDeBug</Text>
        </View>
      </SafeAreaView>

      <CustomAlert
        visible={showLogoutAlert}
        theme={theme}
        assets={assets}
        message="¿Estás seguro que deseas cerrar sesión?"
        onAccept={confirmLogout}
        onCancel={() => setShowLogoutAlert(false)}
        showResetButton={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  userSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 12,
  },
  bottomLogout: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
});
