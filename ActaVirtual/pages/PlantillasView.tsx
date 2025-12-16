import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useCommunity } from '../context/CommunityContext';
import VectorIcon from '../components/VectorIcon';
import CustomAlert from '../components/CustomAlert';
import { Partido, Jugador, StaffMember } from '../types/MockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Plantilla = {
  jugadores: Jugador[];
  liberos: Jugador[];
  primerEntrenador?: StaffMember;
  segundoEntrenador?: StaffMember;
  delegado?: StaffMember;
  fisio?: StaffMember;
};

type PlantillasViewProps = {
  partido: Partido;
  onContinuar: () => void;
};

export default function PlantillasView({ partido, onContinuar }: PlantillasViewProps) {
  const { theme, assets } = useCommunity();
  const [activeTab, setActiveTab] = useState<'local' | 'visitante'>('local');
  const [plantillaLocal, setPlantillaLocal] = useState<Plantilla>({
    jugadores: [],
    liberos: [],
  });
  const [plantillaVisitante, setPlantillaVisitante] = useState<Plantilla>({
    jugadores: [],
    liberos: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [tipoPersonal, setTipoPersonal] = useState<
    'jugador' | 'libero' | 'primerEntrenador' | 'segundoEntrenador' | 'delegado' | 'fisio'
  >('jugador');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    dorsal: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const scrollX = useRef(new Animated.Value(0)).current;
  const contentScrollRef = useRef<ScrollView>(null);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  if (!theme || !assets) {
    return null;
  }

  const changeTab = (tab: 'local' | 'visitante') => {
    setActiveTab(tab);
    const page = tab === 'local' ? 0 : 1;
    contentScrollRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
  };

  const containerWidth = SCREEN_WIDTH - 32;
  const tabWidth = containerWidth / 2;
  const indicatorTranslateX = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, tabWidth],
    extrapolate: 'clamp',
  });

  const getPlanillaActual = () => {
    return activeTab === 'local' ? plantillaLocal : plantillaVisitante;
  };

  const setPlanillaActual = (plantilla: Plantilla) => {
    if (activeTab === 'local') {
      setPlantillaLocal(plantilla);
    } else {
      setPlantillaVisitante(plantilla);
    }
  };

  const openAddModal = (tipo: typeof tipoPersonal) => {
    setTipoPersonal(tipo);
    setFormData({ nombre: '', apellidos: '', dni: '', dorsal: '' });
    setShowAddModal(true);
  };

  const handleAddPersonal = () => {
    if (!formData.nombre || !formData.apellidos || !formData.dni) {
      setAlertMessage('Por favor, completa todos los campos obligatorios');
      setShowAlert(true);
      return;
    }

    const plantillaActual = getPlanillaActual();
    const newPerson = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      dorsal: formData.dorsal,
    };

    if (tipoPersonal === 'jugador') {
      if (plantillaActual.jugadores.length >= 14) {
        setAlertMessage('No puedes añadir más de 14 jugadores');
        setShowAlert(true);
        return;
      }
      setPlanillaActual({
        ...plantillaActual,
        jugadores: [...plantillaActual.jugadores, newPerson],
      });
    } else if (tipoPersonal === 'libero') {
      if (plantillaActual.liberos.length >= 2) {
        setAlertMessage('No puedes añadir más de 2 líberos');
        setShowAlert(true);
        return;
      }
      setPlanillaActual({
        ...plantillaActual,
        liberos: [...plantillaActual.liberos, newPerson],
      });
    } else {
      setPlanillaActual({
        ...plantillaActual,
        [tipoPersonal]: newPerson,
      });
    }

    setShowAddModal(false);
    setFormData({ nombre: '', apellidos: '', dni: '', dorsal: '' });
  };

  const handleRemovePersonal = (tipo: typeof tipoPersonal, id: string) => {
    const plantillaActual = getPlanillaActual();

    if (tipo === 'jugador') {
      setPlanillaActual({
        ...plantillaActual,
        jugadores: plantillaActual.jugadores.filter((p) => p.id !== id),
      });
      return;
    }

    if (tipo === 'libero') {
      setPlanillaActual({
        ...plantillaActual,
        liberos: plantillaActual.liberos.filter((p) => p.id !== id),
      });
      return;
    }

    setPlanillaActual({
      ...plantillaActual,
      [tipo]: undefined,
    });
  };

  const getTituloModal = () => {
    const titulos = {
      jugador: 'Añadir Jugador',
      libero: 'Añadir Líbero',
      primerEntrenador: 'Añadir Primer Entrenador',
      segundoEntrenador: 'Añadir Segundo Entrenador',
      delegado: 'Añadir Delegado',
      fisio: 'Añadir Fisio',
    };
    return titulos[tipoPersonal];
  };

  const renderPersonalCard = (
    person: Jugador | StaffMember,
    tipo: typeof tipoPersonal,
    showDorsal: boolean = false
  ) => (
    <Card key={person.id} style={styles.personalCard} mode="elevated">
      <Card.Content style={styles.personalCardContent}>
        <View style={styles.personalInfo}>
          {showDorsal && 'dorsal' in person && person.dorsal && (
            <View style={[styles.dorsalBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.dorsalText}>{person.dorsal}</Text>
            </View>
          )}
          <View style={styles.personalDetails}>
            <Text style={styles.personalName}>
              {person.nombre} {person.apellidos}
            </Text>
            <Text style={styles.personalDni}>DNI: {person.dni}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemovePersonal(tipo, person.id)}
        >
          <VectorIcon name="delete-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderSection = (
    titulo: string,
    icon: string,
    lista: (Jugador | StaffMember)[],
    tipo: typeof tipoPersonal,
    max: number,
    showDorsal: boolean = false
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <VectorIcon name={icon} size={22} color={theme.primary} />
          <Text style={styles.sectionTitle}>{titulo}</Text>
          <View style={[styles.countBadge, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.countText, { color: theme.primary }]}>
              {lista.length}/{max}
            </Text>
          </View>
        </View>
        {lista.length < max && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => openAddModal(tipo)}
          >
            <VectorIcon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {lista.length > 0 ? (
        <View style={styles.personalList}>
          {lista.map((person) => renderPersonalCard(person, tipo, showDorsal))}
        </View>
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No hay {titulo.toLowerCase()} añadidos</Text>
        </View>
      )}
    </View>
  );

  const renderStaffMember = (
    titulo: string,
    icon: string,
    member: StaffMember | undefined,
    tipo: typeof tipoPersonal
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <VectorIcon name={icon} size={22} color={theme.primary} />
          <Text style={styles.sectionTitle}>{titulo}</Text>
        </View>
        {!member && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => openAddModal(tipo)}
          >
            <VectorIcon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {member ? (
        renderPersonalCard(member, tipo, false)
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No hay {titulo.toLowerCase()} asignado</Text>
        </View>
      )}
    </View>
  );

  const renderTeamContent = (plantilla: Plantilla) => (
    <ScrollView
      style={styles.teamScrollView}
      contentContainerStyle={styles.teamScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {renderSection('Jugadores', 'account-group', plantilla.jugadores, 'jugador', 14, true)}
      {renderSection('Líberos', 'shield-account', plantilla.liberos, 'libero', 2, true)}
      {renderStaffMember('Primer Entrenador', 'clipboard-account', plantilla.primerEntrenador, 'primerEntrenador')}
      {renderStaffMember('Segundo Entrenador', 'clipboard-account-outline', plantilla.segundoEntrenador, 'segundoEntrenador')}
      {renderStaffMember('Delegado', 'account-tie', plantilla.delegado, 'delegado')}
      {renderStaffMember('Fisio', 'medical-bag', plantilla.fisio, 'fisio')}
    </ScrollView>
  );

  const canContinue = () => {
    const localOk = plantillaLocal.jugadores.length > 0 && plantillaLocal.primerEntrenador;
    const visitanteOk = plantillaVisitante.jugadores.length > 0 && plantillaVisitante.primerEntrenador;
    return localOk && visitanteOk;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Verificación de Plantillas</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => changeTab('local')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'local' && [styles.activeTabText, { color: theme.primary }],
              ]}
            >
              {partido.equipoLocal}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => changeTab('visitante')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'visitante' && [styles.activeTabText, { color: theme.primary }],
              ]}
            >
              {partido.equipoVisitante}
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: theme.primary,
                transform: [{ translateX: indicatorTranslateX }],
                width: tabWidth,
              },
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
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const page = Math.round(offsetX / SCREEN_WIDTH);
            setActiveTab(page === 0 ? 'local' : 'visitante');
          }}
          style={styles.horizontalScroll}
        >
          {/* Tab Local */}
          <View style={[styles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            {renderTeamContent(plantillaLocal)}
          </View>

          {/* Tab Visitante */}
          <View style={[styles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            {renderTeamContent(plantillaVisitante)}
          </View>
        </Animated.ScrollView>

        {/* Botón Continuar */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: canContinue() ? theme.primary : '#cbd5e1',
              },
            ]}
            onPress={onContinuar}
            disabled={!canContinue()}
          >
            <Text style={styles.continueButtonText}>Continuar al Sorteo</Text>
            <VectorIcon name="arrow-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para añadir personal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getTituloModal()}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <VectorIcon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  placeholder="Introduce el nombre"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Apellidos *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.apellidos}
                  onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
                  placeholder="Introduce los apellidos"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DNI *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dni}
                  onChangeText={(text) => setFormData({ ...formData, dni: text })}
                  placeholder="12345678A"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {(tipoPersonal === 'jugador' || tipoPersonal === 'libero') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dorsal (Opcional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.dorsal}
                    onChangeText={(text) => setFormData({ ...formData, dorsal: text })}
                    placeholder="Número de dorsal"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, { backgroundColor: theme.primary }]}
                onPress={handleAddPersonal}
              >
                <Text style={styles.modalConfirmText}>Añadir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert */}
      <CustomAlert
        visible={showAlert}
        theme={theme}
        assets={assets}
        message={alertMessage}
        onAccept={() => setShowAlert(false)}
        onCancel={() => setShowAlert(false)}
        showResetButton={false}
      />
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
    fontSize: 20,
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
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  activeTabText: {
    fontWeight: '700',
  },
  horizontalScroll: {
    flex: 1,
  },
  tabContentContainer: {
    paddingHorizontal: 16,
  },
  teamScrollView: {
    flex: 1,
  },
  teamScrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalList: {
    gap: 8,
  },
  personalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  personalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  personalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dorsalBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dorsalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  personalDetails: {
    flex: 1,
  },
  personalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  personalDni: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  removeButton: {
    padding: 8,
  },
  emptySection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
