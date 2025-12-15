import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useCommunity } from '../context/CommunityContext';
import CustomAlert from '../components/CustomAlert';
import DrawerMenu from '../components/DrawerMenu';
import NavBarBack from './NavBarBack';
import VectorIcon from '../components/VectorIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Partido = {
  id: string;
  numeroPartido: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  equipoLocal: string;
  equipoVisitante: string;
  arbitro1: string;
  arbitro2: string;
  arbitro3: string;
};

const PARTIDOS_CONFIRMADOS: Partido[] = [
  {
    id: '1',
    numeroPartido: 'P-2025-0147',
    fecha: '15/12/2025',
    hora: '18:00',
    lugar: 'Polideportivo Municipal Sant Jordi',
    categoria: 'Senior',
    equipoLocal: 'FC Barcelona',
    equipoVisitante: 'Real Madrid',
    arbitro1: 'Juan Pérez',
    arbitro2: 'María García',
    arbitro3: 'Carlos López',
  },
  {
    id: '2',
    numeroPartido: 'P-2025-0148',
    fecha: '16/12/2025',
    hora: '20:30',
    lugar: 'Pabellón de Son Moix',
    categoria: 'Juvenil A',
    equipoLocal: 'Atlético Madrid',
    equipoVisitante: 'Valencia CF',
    arbitro1: 'Juan Pérez',
    arbitro2: 'Ana Martínez',
    arbitro3: 'Luis Fernández',
  },
];

const PARTIDOS_PROPUESTOS: Partido[] = [
  {
    id: '3',
    numeroPartido: 'P-2025-0149',
    fecha: '18/12/2025',
    hora: '19:00',
    lugar: 'Centro Deportivo Es Fortí',
    categoria: 'Juvenil B',
    equipoLocal: 'Sevilla FC',
    equipoVisitante: 'Real Betis',
    arbitro1: 'Juan Pérez',
    arbitro2: 'Pedro Sánchez',
    arbitro3: 'Laura Ruiz',
  },
  {
    id: '4',
    numeroPartido: 'P-2025-0150',
    fecha: '20/12/2025',
    hora: '17:30',
    lugar: 'Polideportivo Can Capó',
    categoria: 'Cadete',
    equipoLocal: 'Villarreal CF',
    equipoVisitante: 'Athletic Bilbao',
    arbitro1: 'Juan Pérez',
    arbitro2: 'Carmen Díaz',
    arbitro3: 'Roberto Jiménez',
  },
];

export default function DesignacionesView({ navigation }: any) {
  const { theme, assets } = useCommunity();
  const [activeTab, setActiveTab] = useState<'confirmadas' | 'propuestas'>('confirmadas');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [partidosConfirmados, setPartidosConfirmados] = useState<Partido[]>(PARTIDOS_CONFIRMADOS);
  const [partidosPropuestos, setPartidosPropuestos] = useState<Partido[]>(PARTIDOS_PROPUESTOS);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-320)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const contentScrollRef = useRef<ScrollView>(null);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  // Animación del drawer
  useEffect(() => {
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

  // Función para cambiar de tab con animación
  const changeTab = (tab: 'confirmadas' | 'propuestas') => {
    setActiveTab(tab);
    const page = tab === 'confirmadas' ? 0 : 1;
    contentScrollRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
  };

  // PanResponder para swipe entre tabs
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe derecha -> ir a confirmadas
          changeTab('confirmadas');
        } else if (gestureState.dx < -50) {
          // Swipe izquierda -> ir a propuestas
          changeTab('propuestas');
        }
      },
    })
  ).current;


  if (!theme || !assets) {
    return null;
  }

  const partidos = activeTab === 'confirmadas' ? partidosConfirmados : partidosPropuestos;

  // Calcular el translateX del indicador basado en el ancho del contenedor
  const containerWidth = SCREEN_WIDTH - 32; // Restamos el padding horizontal (16 * 2)
  const tabWidth = containerWidth / 2;
  const indicatorTranslateX = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, tabWidth],
    extrapolate: 'clamp',
  });

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  const aceptarPartido = (partido: Partido) => {
    setPartidosPropuestos(prev => prev.filter(p => p.id !== partido.id));
    setPartidosConfirmados(prev => [...prev, partido]);
  };

  const requestRejectPartido = (id: string) => {
    setSelectedRejectId(id);
    setShowRejectAlert(true);
  };

  const confirmRejectPartido = () => {
    if (!selectedRejectId) return;
    setPartidosPropuestos(prev => prev.filter(p => p.id !== selectedRejectId));
    setSelectedRejectId(null);
    setShowRejectAlert(false);
  };

  const cancelReject = () => {
    setSelectedRejectId(null);
    setShowRejectAlert(false);
  };

  const iniciarActa = (partido: Partido) => {
    // TODO: Navegar a la vista de acta
    console.log('Iniciar acta para partido:', partido.id);
  };

  // Función para renderizar una tarjeta de partido
  const renderPartidoCard = (partido: Partido, tab: 'confirmadas' | 'propuestas') => {
    const isExpanded = expandedCards.has(partido.id);
    return (
      <Card key={partido.id} style={styles.partidoCard} mode="elevated">
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => toggleCard(partido.id)}
        >
          <Card.Content style={styles.cardContent}>
            {/* Fecha y Hora */}
            <View style={styles.dateTimeRow}>
              <View style={styles.infoItem}>
                <VectorIcon name="calendar-blank" size={20} color={theme.primary} />
                <Text style={styles.infoText}>{partido.fecha}</Text>
              </View>
              <View style={styles.infoItem}>
                <VectorIcon name="clock-time-four-outline" size={20} color={theme.primary} />
                <Text style={styles.infoText}>{partido.hora}</Text>
              </View>
            </View>

            {/* Lugar */}
            <View style={styles.lugarContainer}>
              <VectorIcon name="map-marker" size={20} color={theme.primary} />
              <Text style={styles.lugarText}>{partido.lugar}</Text>
            </View>

            {/* Equipos */}
            <View style={[styles.equiposContainer, { borderColor: theme.primary + '20' }]}>
              <View style={styles.equipoBlock}>
                <Text style={styles.equipoLabel}>LOCAL</Text>
                <Text style={styles.equipoNombre}>{partido.equipoLocal}</Text>
              </View>
              <View style={[styles.vsDivider, { backgroundColor: theme.primary }]}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <View style={styles.equipoBlock}>
                <Text style={styles.equipoLabel}>VISITANTE</Text>
                <Text style={styles.equipoNombre}>{partido.equipoVisitante}</Text>
              </View>
            </View>

            {/* Botón de expansión */}
            <View style={styles.expandButton}>
              <Text style={[styles.expandText, { color: theme.primary }]}>
                {isExpanded ? 'Ver menos' : 'Ver más detalles'}
              </Text>
              <VectorIcon 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={theme.primary} 
              />
            </View>

            {/* Detalles expandibles */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />
                
                {/* Número de partido */}
                <View style={styles.detailRow}>
                  <VectorIcon name="pound" size={18} color={theme.primary} />
                  <Text style={styles.detailLabel}>Nº Partido:</Text>
                  <Text style={styles.detailValue}>{partido.numeroPartido}</Text>
                </View>

                {/* Categoría */}
                <View style={styles.detailRow}>
                  <VectorIcon name="shield-star" size={18} color={theme.primary} />
                  <Text style={styles.detailLabel}>Categoría:</Text>
                  <Text style={styles.detailValue}>{partido.categoria}</Text>
                </View>

                {/* Árbitros */}
                <View style={styles.arbitrosSection}>
                  <View style={styles.arbitrosHeader}>
                    <VectorIcon name="whistle" size={18} color={theme.primary} />
                    <Text style={styles.arbitrosTitle}>Árbitros Designados</Text>
                  </View>
                  <View style={styles.arbitrosList}>
                    <View style={styles.arbitroRow}>
                      <View style={[styles.arbitroBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.arbitroBadgeText}>1º</Text>
                      </View>
                      <Text style={styles.arbitroNombre}>{partido.arbitro1}</Text>
                    </View>
                    <View style={styles.arbitroRow}>
                      <View style={[styles.arbitroBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.arbitroBadgeText}>2º</Text>
                      </View>
                      <Text style={styles.arbitroNombre}>{partido.arbitro2}</Text>
                    </View>
                    <View style={styles.arbitroRow}>
                      <View style={[styles.arbitroBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.arbitroBadgeText}>3º</Text>
                      </View>
                      <Text style={styles.arbitroNombre}>{partido.arbitro3}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Botones de acción */}
            {tab === 'propuestas' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButtonOutline, { borderColor: '#ef4444' }]}
                  onPress={() => requestRejectPartido(partido.id)}
                >
                  <VectorIcon name="close" size={18} color="#ef4444" />
                  <Text style={[styles.actionButtonOutlineText, { color: '#ef4444' }]}>Rechazar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  onPress={() => aceptarPartido(partido)}
                >
                  <VectorIcon name="check" size={18} color="#ffffff" />
                  <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            )}

            {tab === 'confirmadas' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  onPress={() => iniciarActa(partido)}
                >
                  <VectorIcon name="play" size={18} color="#ffffff" />
                  <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>Iniciar Acta</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <NavBarBack 
        onBack={() => navigation.goBack()} 
        onMenuPress={() => setDrawerVisible(true)}
      />

      <View style={styles.content}>
        <Text style={styles.headerTitle}>Mis Designaciones</Text>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => changeTab('confirmadas')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === 'confirmadas' && [styles.activeTabText, { color: theme.primary }]]}
            >
              Confirmadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => changeTab('propuestas')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Text
                style={[styles.tabText, activeTab === 'propuestas' && [styles.activeTabText, { color: theme.primary }]]}
              >
                Propuestas
              </Text>
              {partidosPropuestos.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{partidosPropuestos.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* Barra indicadora animada */}
          <Animated.View 
            style={[
              styles.tabIndicator, 
              { 
                backgroundColor: theme.primary,
                transform: [{ translateX: indicatorTranslateX }],
                width: tabWidth,
              }
            ]} 
          />
        </View>

        {/* Contenido deslizable */}
        <Animated.ScrollView
          ref={contentScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const page = Math.round(offsetX / SCREEN_WIDTH);
            setActiveTab(page === 0 ? 'confirmadas' : 'propuestas');
          }}
          style={styles.horizontalScroll}
        >
          {/* Tab Confirmadas */}
          <View style={[styles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {partidosConfirmados.map((partido) => renderPartidoCard(partido, 'confirmadas'))}
              {partidosConfirmados.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No hay partidos confirmados
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Tab Propuestas */}
          <View style={[styles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {partidosPropuestos.map((partido) => renderPartidoCard(partido, 'propuestas'))}
              {partidosPropuestos.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No hay partidos propuestos
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.ScrollView>
        <CustomAlert
          visible={showRejectAlert}
          theme={theme}
          assets={assets}
          message="¿Estás seguro que quieres rechazar este partido?"
          onAccept={confirmRejectPartido}
          onCancel={cancelReject}
          showResetButton={false}
        />
      </View>

      {/* Drawer Menu Modal */}
      <Modal
        visible={drawerVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setDrawerVisible(false)} />
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnimation }] }]}>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  activeTabText: {
    fontWeight: '700',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  horizontalScroll: {
    flex: 1,
  },
  tabContentContainer: {
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  partidoCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  lugarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  lugarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  equiposContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  equipoBlock: {
    flex: 1,
    alignItems: 'center',
  },
  equipoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  equipoNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  vsDivider: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  vsText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '700',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  arbitrosSection: {
    marginTop: 8,
  },
  arbitrosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  arbitrosTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  arbitrosList: {
    gap: 8,
  },
  arbitroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  arbitroBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arbitroBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  arbitroNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  acceptButton: {
    backgroundColor: 'transparent',
  },
  rejectButton: {
    backgroundColor: 'transparent',
  },
  startButton: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    gap: 8,
  },
  actionButtonOutlineText: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});
