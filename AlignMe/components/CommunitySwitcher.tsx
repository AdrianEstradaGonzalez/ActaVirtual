/**
 * 🔄 COMMUNITY SWITCHER BUTTON
 * ============================
 * Botón flotante para cambiar de comunidad desde cualquier pantalla
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../context/CommunityContext';

interface CommunitySwitcherProps {
  onPress: () => void;
}

export const CommunitySwitcher: React.FC<CommunitySwitcherProps> = ({ onPress }) => {
  const { theme, communityId } = useCommunity();

  if (!theme || !communityId) return null;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.actionCardBg }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Image source={require('../assets/icons/swap.png')} style={styles.icon} resizeMode="contain" />
        <Text style={[styles.text, { color: theme.actionCardText }]}>Seleccionar Comunidad</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 40,
    left: Dimensions.get('window').width * 0.05,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#fff',
  },
});
