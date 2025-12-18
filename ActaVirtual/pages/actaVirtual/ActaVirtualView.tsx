import React, { useState, useRef } from 'react';
import { View, Modal, Animated, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import DrawerMenu from '../../components/DrawerMenu';
import NavBarBack from '../navBars/NavBarBack';
import PlantillasView from '../actaFases/PlantillasView';
import SorteoView from '../actaFases/SorteoView';
import FirmasView from '../actaFases/FirmasView';
import { Partido } from '../../types/MockData';
import { styles } from './styles/ActaVirtualStyles';

type ActaVirtualProps = {
  navigation: any;
  route: {
    params: {
      partido: Partido;
    };
  };
};

type FaseActa = 'plantillas' | 'sorteo' | 'firmas' | 'partido' | 'finalizacion';

export default function ActaVirtualView({ navigation, route }: ActaVirtualProps) {
  const { theme, assets } = useCommunity();
  const [partido, setPartido] = useState<Partido>(route.params.partido);
  const [headerExpanded, setHeaderExpanded] = useState<boolean>(false);
  const [faseActual, setFaseActual] = useState<FaseActa>('plantillas');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [observModalVisible, setObservModalVisible] = useState(false);
  const [observaciones, setObservaciones] = useState<string>(partido.observaciones || '');
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
        return <PlantillasView partido={partido} onUpdatePartido={setPartido} />;
      case 'sorteo':
        return <SorteoView partido={partido} />;
      case 'firmas':
        return <FirmasView partido={partido} />;
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

  const getFaseColor = (fase: FaseActa) => {
    const fases: FaseActa[] = ['plantillas', 'sorteo', 'firmas', 'partido', 'finalizacion'];
    const currentIndex = fases.indexOf(faseActual);
    const faseIndex = fases.indexOf(fase);
    
    if (faseIndex < currentIndex) return 'completed';
    if (faseIndex === currentIndex) return 'active';
    return 'inactive';
  };

  const formatDateTime = () => {
    // Formato: dd/mm/aaaa hh:mm
    return `${partido.fecha} - ${partido.hora}`;
  };

  return (
    <View style={styles.container}>
      <NavBarBack
        onBack={() => navigation.goBack()}
        onMenuPress={() => setDrawerVisible(true)}
      />

      {/* Header con gradiente */}
      <View style={styles.headerContainer}>
        <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
          <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Acta Virtual</Text>
                <TouchableOpacity
                  style={styles.obsButton}
                  onPress={() => setObservModalVisible(true)}
                >
                  <VectorIcon name="note-outline" size={16} color="#ffffff" />
                  <Text style={[styles.obsButtonText, { marginLeft: 8 }]}>Observaciones</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.matchCard}
                onPress={() => setHeaderExpanded(prev => !prev)}
              >
                <View style={styles.matchRow}>
                  <View style={styles.teamContainer}>
                    <Text style={styles.teamName}>{partido.equipoLocal}</Text>
                  </View>
                  <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <View style={styles.teamContainer}>
                    <Text style={styles.teamName}>{partido.equipoVisitante}</Text>
                  </View>
                </View>

                {headerExpanded && (
                  <View style={styles.matchDetails}>
                    <View style={styles.matchDetailRow}>
                      <VectorIcon name="shield-star" size={14} color="#475569" />
                      <Text style={styles.matchDetailText}>{partido.categoria}</Text>
                    </View>
                    <View style={styles.matchDetailRow}>
                      <VectorIcon name="pound" size={14} color="#475569" />
                      <Text style={styles.matchDetailText}>{partido.competicion}</Text>
                    </View>
                    <View style={styles.matchDetailRow}>
                      <VectorIcon name="calendar-blank" size={14} color="#475569" />
                      <Text style={styles.matchDetailText}>{partido.fecha}</Text>
                    </View>
                    <View style={styles.matchDetailRow}>
                      <VectorIcon name="clock-time-four-outline" size={14} color="#475569" />
                      <Text style={styles.matchDetailText}>{partido.hora}</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.matchToggleContainer}
                  onPress={() => setHeaderExpanded(prev => !prev)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.matchToggleText}>{headerExpanded ? 'Mostrar menos' : 'Mostrar más'}</Text>
                  <VectorIcon name={headerExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#334155" />
                </TouchableOpacity>
              </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Indicador de fases mejorado */}
      <View style={styles.fasesWrapper}>
        <View style={styles.fasesIndicator}>
          <TouchableOpacity
            style={styles.faseStep}
            onPress={() => setFaseActual('plantillas')}
          >
            <View style={[
              styles.faseCircle,
              getFaseColor('plantillas') === 'completed' && styles.faseCompleted,
              getFaseColor('plantillas') === 'active' && { 
                backgroundColor: theme.primary,
                ...styles.faseActive 
              },
              getFaseColor('plantillas') === 'inactive' && styles.faseInactive,
            ]}>
              {getFaseColor('plantillas') === 'completed' ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.faseNumber,
                  { color: getFaseColor('plantillas') === 'active' ? '#ffffff' : '#94a3b8' }
                ]}>1</Text>
              )}
            </View>
            <Text style={[
              styles.faseLabel,
              { color: getFaseColor('plantillas') === 'active' ? theme.primary : '#64748b' }
            ]}>Plantillas</Text>
          </TouchableOpacity>

          <View style={[
            styles.faseLine,
            getFaseColor('sorteo') === 'completed' && { backgroundColor: theme.primary },
            getFaseColor('sorteo') === 'active' && { backgroundColor: theme.primary, opacity: 0.3 },
          ]} />

          <TouchableOpacity
            style={styles.faseStep}
            onPress={() => setFaseActual('sorteo')}
          >
            <View style={[
              styles.faseCircle,
              getFaseColor('sorteo') === 'completed' && styles.faseCompleted,
              getFaseColor('sorteo') === 'active' && { 
                backgroundColor: theme.primary,
                ...styles.faseActive 
              },
              getFaseColor('sorteo') === 'inactive' && styles.faseInactive,
            ]}>
              {getFaseColor('sorteo') === 'completed' ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.faseNumber,
                  { color: getFaseColor('sorteo') === 'active' ? '#ffffff' : '#94a3b8' }
                ]}>2</Text>
              )}
            </View>
            <Text style={[
              styles.faseLabel,
              { color: getFaseColor('sorteo') === 'active' ? theme.primary : '#64748b' }
            ]}>Sorteo</Text>
          </TouchableOpacity>

          <View style={[
            styles.faseLine,
            getFaseColor('firmas') === 'completed' && { backgroundColor: theme.primary },
            getFaseColor('firmas') === 'active' && { backgroundColor: theme.primary, opacity: 0.3 },
          ]} />

          <TouchableOpacity
            style={styles.faseStep}
            onPress={() => setFaseActual('firmas')}
          >
            <View style={[
              styles.faseCircle,
              getFaseColor('firmas') === 'completed' && styles.faseCompleted,
              getFaseColor('firmas') === 'active' && { 
                backgroundColor: theme.primary,
                ...styles.faseActive 
              },
              getFaseColor('firmas') === 'inactive' && styles.faseInactive,
            ]}>
              {getFaseColor('firmas') === 'completed' ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.faseNumber,
                  { color: getFaseColor('firmas') === 'active' ? '#ffffff' : '#94a3b8' }
                ]}>3</Text>
              )}
            </View>
            <Text style={[
              styles.faseLabel,
              { color: getFaseColor('firmas') === 'active' ? theme.primary : '#64748b' }
            ]}>Firmas</Text>
          </TouchableOpacity>

          <View style={[
            styles.faseLine,
            getFaseColor('partido') === 'completed' && { backgroundColor: theme.primary },
            getFaseColor('partido') === 'active' && { backgroundColor: theme.primary, opacity: 0.3 },
          ]} />

          <TouchableOpacity
            style={styles.faseStep}
            onPress={() => setFaseActual('partido')}
          >
            <View style={[
              styles.faseCircle,
              getFaseColor('partido') === 'completed' && styles.faseCompleted,
              getFaseColor('partido') === 'active' && { 
                backgroundColor: theme.primary,
                ...styles.faseActive 
              },
              getFaseColor('partido') === 'inactive' && styles.faseInactive,
            ]}>
              {getFaseColor('partido') === 'completed' ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.faseNumber,
                  { color: getFaseColor('partido') === 'active' ? '#ffffff' : '#94a3b8' }
                ]}>4</Text>
              )}
            </View>
            <Text style={[
              styles.faseLabel,
              { color: getFaseColor('partido') === 'active' ? theme.primary : '#64748b' }
            ]}>Partido</Text>
          </TouchableOpacity>

          <View style={[
            styles.faseLine,
            getFaseColor('finalizacion') === 'completed' && { backgroundColor: theme.primary },
            getFaseColor('finalizacion') === 'active' && { backgroundColor: theme.primary, opacity: 0.3 },
          ]} />

          <TouchableOpacity
            style={styles.faseStep}
            onPress={() => setFaseActual('finalizacion')}
          >
            <View style={[
              styles.faseCircle,
              getFaseColor('finalizacion') === 'completed' && styles.faseCompleted,
              getFaseColor('finalizacion') === 'active' && { 
                backgroundColor: theme.primary,
                ...styles.faseActive 
              },
              getFaseColor('finalizacion') === 'inactive' && styles.faseInactive,
            ]}>
              {getFaseColor('finalizacion') === 'completed' ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.faseNumber,
                  { color: getFaseColor('finalizacion') === 'active' ? '#ffffff' : '#94a3b8' }
                ]}>5</Text>
              )}
            </View>
            <Text style={[
              styles.faseLabel,
              { color: getFaseColor('finalizacion') === 'active' ? theme.primary : '#64748b' }
            ]}>Fin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido de la fase actual */}
      <View style={styles.content}>
        {renderFaseActual()}
      </View>

      {/* Observaciones Modal (accesible desde cualquier fase) */}
      <Modal
        visible={observModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setObservModalVisible(false)}
      >
        <View style={styles.obsModalContainer}>
          <View style={styles.obsModalContent}>
            <View style={styles.obsHeader}>
              <Text style={styles.obsTitle}>Observaciones del Árbitro</Text>
              <TouchableOpacity onPress={() => setObservModalVisible(false)}>
                <Text style={styles.obsCloseButton}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              multiline
              placeholder="Escribe aquí las observaciones..."
              value={observaciones}
              onChangeText={setObservaciones}
              style={styles.obsTextInput}
              scrollEnabled={true}
              textAlignVertical="top"
            />
            <View style={styles.obsActionsRow}>
              <TouchableOpacity
                style={styles.obsSaveButton}
                onPress={() => {
                  setPartido({ ...partido, observaciones });
                  setObservModalVisible(false);
                }}
              >
                <Text style={styles.obsSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
