import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Animated, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import DrawerMenu from '../../components/DrawerMenu';
import NavBarBack from '../navBars/NavBarBack';
import PlantillasView from '../actaFases/PlantillasView';
import { Partido } from '../../types/MockData';

type ActaVirtualProps = {
  navigation: any;
  route: {
    params: {
      partido: Partido;
    };
  };
};

type FaseActa = 'plantillas' | 'sorteo' | 'partido' | 'finalizacion';

export default function ActaVirtualView({ navigation, route }: ActaVirtualProps) {
  const { theme, assets } = useCommunity();
  const { partido } = route.params;
  const [faseActual, setFaseActual] = useState<FaseActa>('plantillas');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-320)).current;

  React.useEffect(() => {
    if (drawerVisible) {
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnimation, {
        toValue: -320,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerVisible]);

  if (!theme || !assets) {
    return null;
  }

  const renderFaseActual = () => {
    switch (faseActual) {
      case 'plantillas':
        return (
          <PlantillasView
            partido={partido}
            onContinuar={() => setFaseActual('sorteo')}
          />
        );
      case 'sorteo':
        return (
          <View style={styles.faseContainer}>
            <Text style={styles.faseText}>Fase de Sorteo (Próximamente)</Text>
          </View>
        );
      case 'partido':
        return (
          <View style={styles.faseContainer}>
            <Text style={styles.faseText}>Fase de Partido (Próximamente)</Text>
          </View>
        );
      case 'finalizacion':
        return (
          <View style={styles.faseContainer}>
            <Text style={styles.faseText}>Fase de Finalización (Próximamente)</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <NavBarBack
        onBack={() => navigation.goBack()}
        onMenuPress={() => setDrawerVisible(true)}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Acta Virtual</Text>
        <Text style={styles.subtitle}>{partido.numeroPartido}</Text>
        <View style={styles.matchInfo}>
          <Text style={styles.matchText}>
            {partido.equipoLocal} vs {partido.equipoVisitante}
          </Text>
        </View>
      </View>

      {/* Indicador de fases */}
      <View style={styles.fasesIndicator}>
        <View style={styles.faseStep}>
          <View style={[
            styles.faseCircle,
            { backgroundColor: faseActual === 'plantillas' ? theme.primary : '#e2e8f0' }
          ]}>
            <Text style={[
              styles.faseNumber,
              { color: faseActual === 'plantillas' ? '#ffffff' : '#64748b' }
            ]}>1</Text>
          </View>
          <Text style={[
            styles.faseLabel,
            { color: faseActual === 'plantillas' ? theme.primary : '#64748b' }
          ]}>Plantillas</Text>
        </View>

        <View style={[styles.faseLine, { backgroundColor: '#e2e8f0' }]} />

        <View style={styles.faseStep}>
          <View style={[
            styles.faseCircle,
            { backgroundColor: faseActual === 'sorteo' ? theme.primary : '#e2e8f0' }
          ]}>
            <Text style={[
              styles.faseNumber,
              { color: faseActual === 'sorteo' ? '#ffffff' : '#64748b' }
            ]}>2</Text>
          </View>
          <Text style={[
            styles.faseLabel,
            { color: faseActual === 'sorteo' ? theme.primary : '#64748b' }
          ]}>Sorteo</Text>
        </View>

        <View style={[styles.faseLine, { backgroundColor: '#e2e8f0' }]} />

        <View style={styles.faseStep}>
          <View style={[
            styles.faseCircle,
            { backgroundColor: faseActual === 'partido' ? theme.primary : '#e2e8f0' }
          ]}>
            <Text style={[
              styles.faseNumber,
              { color: faseActual === 'partido' ? '#ffffff' : '#64748b' }
            ]}>3</Text>
          </View>
          <Text style={[
            styles.faseLabel,
            { color: faseActual === 'partido' ? theme.primary : '#64748b' }
          ]}>Partido</Text>
        </View>

        <View style={[styles.faseLine, { backgroundColor: '#e2e8f0' }]} />

        <View style={styles.faseStep}>
          <View style={[
            styles.faseCircle,
            { backgroundColor: faseActual === 'finalizacion' ? theme.primary : '#e2e8f0' }
          ]}>
            <Text style={[
              styles.faseNumber,
              { color: faseActual === 'finalizacion' ? '#ffffff' : '#64748b' }
            ]}>4</Text>
          </View>
          <Text style={[
            styles.faseLabel,
            { color: faseActual === 'finalizacion' ? theme.primary : '#64748b' }
          ]}>Fin</Text>
        </View>
      </View>

      {/* Contenido de la fase actual */}
      <View style={styles.content}>
        {renderFaseActual()}
      </View>

      {/* Drawer Menu Modal */}
      <Modal
        visible={drawerVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setDrawerVisible(false)}
          />
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: drawerAnimation }] }
            ]}
          >
            <DrawerMenu
              navigation={navigation}
              onClose={() => setDrawerVisible(false)}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  matchInfo: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  matchText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  fasesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  faseStep: {
    alignItems: 'center',
    gap: 8,
  },
  faseCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faseNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  faseLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faseLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  faseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  faseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  drawerContainer: {
    width: '80%',
    height: '100%',
    maxWidth: 320,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
