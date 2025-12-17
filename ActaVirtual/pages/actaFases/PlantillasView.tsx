import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import VectorIcon from '../../components/VectorIcon';
import CustomAlert from '../../components/CustomAlert';
import { Partido, Categoria } from '../../types/MockData';
import * as MockData from '../../types/MockData';
import { usePlantillaManager, Plantilla } from './hooks/usePlantillaManager';
import { JugadoresDisponiblesView } from './components/JugadoresDisponiblesView';
import { StaffDisponiblesView } from './components/StaffDisponiblesView';
import { PersonalCard, StaffCard } from './components/PersonalCard';
import {
  plantillasStyles,
  sectionStyles,
  modalStyles,
  SCREEN_WIDTH,
} from './styles/PlantillasStyles';

type PlantillasViewProps = {
  partido: Partido;
  onContinuar: () => void;
};

export default function PlantillasView({ partido, onContinuar }: PlantillasViewProps) {
  const { theme, assets } = useCommunity();
  const {
    plantillaLocal,
    plantillaVisitante,
    activeTab,
    setActiveTab,
    getPlanillaActual,
    sortByName,
    addJugador,
    addJugadorNuevo,
    addStaff,
    toggleCapitan,
    removePersonal,
    canContinue,
  } = usePlantillaManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState<'seleccionar' | 'nuevo' | 'otros'>('seleccionar');
  const [tipoPersonal, setTipoPersonal] = useState<'jugador' | 'libero' | 'staff'>('jugador');
  const [rolStaff, setRolStaff] = useState<'entrenador' | 'delegado' | 'entrenadorAsistente'>('entrenador');
  const [categoriaJugador, setCategoriaJugador] = useState<Categoria>('Senior');
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

  const openAddModal = (tipo: typeof tipoPersonal) => {
    setTipoPersonal(tipo);
    setFormData({ nombre: '', apellidos: '', dni: '', dorsal: '' });
    setRolStaff('entrenador');
    setCategoriaJugador('Senior');
    setModalTab('seleccionar');
    setShowAddModal(true);
  };

  const jugadoresDisponibles = useMemo(() => {
    const jugadores = activeTab === 'local'
      ? (partido.jugadoresDisponiblesLocal || [])
      : (partido.jugadoresDisponiblesVisitante || []);

    const plantillaActual = getPlanillaActual();
    const idsEnActa = [...plantillaActual.jugadores, ...plantillaActual.liberos].map(j => j.id);

    return jugadores.filter(j => !idsEnActa.includes(j.id));
  }, [activeTab, partido, plantillaLocal, plantillaVisitante]);

  const staffDisponibles = useMemo(() => {
    const staff = activeTab === 'local'
      ? (partido.staffDisponibleLocal || [])
      : (partido.staffDisponibleVisitante || []);

    const plantillaActual = getPlanillaActual();
    const idsEnActa = plantillaActual.staff.map(s => s.id);

    return staff.filter(s => !idsEnActa.includes(s.id));
  }, [activeTab, partido, plantillaLocal, plantillaVisitante]);

  const otrosJugadores = useMemo(() => {
    const plantillaActual = getPlanillaActual();
    const idsEnActa = [...plantillaActual.jugadores, ...plantillaActual.liberos].map(j => j.id);

    // Collect all player arrays from MockData (optimized)
    const allPlayers: any[] = [
      ...(MockData.JUGADORES_CV_TERUEL || []),
      ...(MockData.LIBEROS_CV_TERUEL || []),
      ...(MockData.JUGADORES_UNICAJA_ALMERIA || []),
      ...(MockData.LIBEROS_UNICAJA_ALMERIA || []),
      ...(MockData.JUGADORES_ARENAL_EMEVE || []),
      ...(MockData.LIBEROS_ARENAL_EMEVE || []),
      ...(MockData.JUGADORES_CV_PALMA || []),
      ...(MockData.LIBEROS_CV_PALMA || []),
    ];

    // Deduplicate by id using Set for better performance
    const seen = new Set<string>();
    const uniquePlayers = allPlayers.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const disponibles = activeTab === 'local'
      ? (partido.jugadoresDisponiblesLocal || [])
      : (partido.jugadoresDisponiblesVisitante || []);
    const idsDisponibles = new Set(disponibles.map(d => d.id));
    const idsEnActaSet = new Set(idsEnActa);

    // Filter out players already in the acta or already listed as disponibles for this match
    return uniquePlayers.filter(p => !idsEnActaSet.has(p.id) && !idsDisponibles.has(p.id));
  }, [activeTab, partido, plantillaLocal, plantillaVisitante]);

  const handleSelectJugador = (jugador: any, dorsal: string, esCapitan: boolean, esLibero: boolean) => {
    const jugadorConDorsal = { ...jugador, dorsal: dorsal || jugador.dorsal };
    const tipo = esLibero ? 'libero' : 'jugador';
    const result = addJugador(jugadorConDorsal, tipo, esCapitan);

    if (!result.success && result.error) {
      setAlertMessage(result.error);
      setShowAlert(true);
      return;
    }

    setShowAddModal(false);
  };

  const handleAddAll = (items: {
    esLibero: any; jugador: any; dorsal: string; esCapitan: boolean 
}[]) => {
    const plantillaActual = getPlanillaActual();
    const totalActual = plantillaActual.jugadores.length + plantillaActual.liberos.length;
    const totalDespuesDeAñadir = totalActual + items.length;

    // Validar límite de 14 jugadores
    if (totalDespuesDeAñadir > 14) {
      setAlertMessage(`No se pueden añadir ${items.length} jugador${items.length !== 1 ? 'es' : ''}. Ya tienes ${totalActual} y el máximo es 14.`);
      setShowAlert(true);
      return;
    }

    const failures: string[] = [];
    let anySuccess = false;

    for (const it of items) {
      const jugadorConDorsal = { ...it.jugador, dorsal: it.dorsal };
      // Determinar el tipo basándose en si fue marcado como líbero en la selección
      const tipo = it.esLibero ? 'libero' : 'jugador';
      const result = addJugador(jugadorConDorsal, tipo, it.esCapitan);
      if (!result.success) {
        failures.push(`${it.jugador.apellidos}, ${it.jugador.nombre}: ${result.error}`);
      } else {
        anySuccess = true;
      }
    }

    if (failures.length > 0) {
      setAlertMessage('Algunos jugadores no se añadieron:\n' + failures.join('\n'));
      setShowAlert(true);
    }

    if (anySuccess) {
      setShowAddModal(false);
    }
  };

  const handleSelectStaff = (staff: any, rol: 'entrenador' | 'delegado' | 'entrenadorAsistente') => {
    const staffConRol = { ...staff, rol };
    const result = addStaff(staffConRol, rol);

    if (!result.success && result.error) {
      setAlertMessage(result.error);
      setShowAlert(true);
      return;
    }

    setShowAddModal(false);
  };

  const handleAddPersonal = () => {
    if (!formData.nombre || !formData.apellidos || !formData.dni) {
      setAlertMessage('Por favor, completa todos los campos obligatorios');
      setShowAlert(true);
      return;
    }

    if (tipoPersonal === 'jugador' || tipoPersonal === 'libero') {
      if (!formData.dorsal) {
        setAlertMessage('El número de dorsal es obligatorio');
        setShowAlert(true);
        return;
      }

      const jugadorConCategoria = { ...formData, categoria: categoriaJugador };
      const result = addJugadorNuevo(jugadorConCategoria, tipoPersonal);
      if (!result.success && result.error) {
        setAlertMessage(result.error);
        setShowAlert(true);
        return;
      }
    } else if (tipoPersonal === 'staff') {
      const result = addStaff(formData, rolStaff);
      if (!result.success && result.error) {
        setAlertMessage(result.error);
        setShowAlert(true);
        return;
      }
    }

    setShowAddModal(false);
    setFormData({ nombre: '', apellidos: '', dni: '', dorsal: '' });
  };

  const getTituloModal = () => {
    const titulos = {
      jugador: 'Añadir Jugador',
      libero: 'Añadir Líbero',
      staff: 'Añadir Técnico',
    };
    return titulos[tipoPersonal];
  };

  const renderSection = (
    titulo: string,
    icon: string,
    lista: any[],
    tipo: 'jugador' | 'libero' | 'staff',
    max: number,
    showDorsal: boolean = false
  ) => (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.sectionHeader}>
        <View style={sectionStyles.sectionTitleContainer}>
          <VectorIcon name={icon} size={22} color={theme.primary} />
          <Text style={sectionStyles.sectionTitle}>{titulo}</Text>
          <View style={[sectionStyles.countBadge, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[sectionStyles.countText, { color: theme.primary }]}>
              {lista.length}/{max}
            </Text>
          </View>
        </View>
        {lista.length < max && tipo !== 'libero' && (
          <TouchableOpacity
            style={[sectionStyles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => openAddModal(tipo)}
          >
            <VectorIcon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {lista.length > 0 ? (
        <View style={sectionStyles.personalList}>
          {lista.map((person) => (
            <PersonalCard
              key={person.id}
              person={person}
              tipo={tipo}
              theme={theme}
              showDorsal={showDorsal}
              onToggleCapitan={toggleCapitan}
              onRemove={removePersonal}
            />
          ))}
        </View>
      ) : (
        <View style={sectionStyles.emptySection}>
          <Text style={sectionStyles.emptyText}>No hay {titulo.toLowerCase()} añadidos</Text>
        </View>
      )}
    </View>
  );

  const renderStaffSection = (plantilla: Plantilla) => {
    const staffOrdenado = sortByName(plantilla.staff);
    const maxStaff = 6; // 1 entrenador + 1 delegado + 4 asistentes

    return (
      <View style={sectionStyles.section}>
        <View style={sectionStyles.sectionHeader}>
          <View style={sectionStyles.sectionTitleContainer}>
            <VectorIcon name="account-tie" size={22} color={theme.primary} />
            <Text style={sectionStyles.sectionTitle}>Técnicos</Text>
            <View style={[sectionStyles.countBadge, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[sectionStyles.countText, { color: theme.primary }]}>
                {plantilla.staff.length}/{maxStaff}
              </Text>
            </View>
          </View>
          {plantilla.staff.length < maxStaff && (
            <TouchableOpacity
              style={[sectionStyles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => openAddModal('staff')}
            >
              <VectorIcon name="plus" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        {staffOrdenado.length > 0 ? (
          <View style={sectionStyles.personalList}>
            {staffOrdenado.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                theme={theme}
                onRemove={removePersonal}
              />
            ))}
          </View>
        ) : (
          <View style={sectionStyles.emptySection}>
            <Text style={sectionStyles.emptyText}>No hay técnicos añadidos</Text>
          </View>
        )}

        {/* Trainers are optional now; no warning displayed */}
      </View>
    );
  };

  const renderTeamContent = (plantilla: Plantilla) => {
    const jugadoresOrdenados = sortByName(plantilla.jugadores);
    const liberosOrdenados = sortByName(plantilla.liberos);

    return (
      <ScrollView
        style={plantillasStyles.teamScrollView}
        contentContainerStyle={plantillasStyles.teamScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Jugadores', 'account-group', jugadoresOrdenados, 'jugador', 14, true)}
        {renderSection('Líberos', 'shield-account', liberosOrdenados, 'libero', 2, true)}
        {renderStaffSection(plantilla)}
      </ScrollView>
    );
  };

  return (
    <View style={plantillasStyles.container}>
      <View style={plantillasStyles.content}>
        <Text style={plantillasStyles.headerTitle}>Verificación de Plantillas</Text>

        {/* Tabs */}
        <View style={plantillasStyles.tabsContainer}>
          <TouchableOpacity
            style={plantillasStyles.tab}
            onPress={() => changeTab('local')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                plantillasStyles.tabText,
                activeTab === 'local' && [plantillasStyles.activeTabText, { color: theme.primary }],
              ]}
            >
              {partido.equipoLocal}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={plantillasStyles.tab}
            onPress={() => changeTab('visitante')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                plantillasStyles.tabText,
                activeTab === 'visitante' && [plantillasStyles.activeTabText, { color: theme.primary }],
              ]}
            >
              {partido.equipoVisitante}
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              plantillasStyles.tabIndicator,
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
          style={plantillasStyles.horizontalScroll}
        >
          {/* Tab Local */}
          <View style={[plantillasStyles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            {renderTeamContent(plantillaLocal)}
          </View>

          {/* Tab Visitante */}
          <View style={[plantillasStyles.tabContentContainer, { width: SCREEN_WIDTH - 32 }]}>
            {renderTeamContent(plantillaVisitante)}
          </View>
        </Animated.ScrollView>

        {/* Botón Continuar */}
        <View style={plantillasStyles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              plantillasStyles.continueButton,
              {
                backgroundColor: canContinue() ? theme.primary : '#cbd5e1',
              },
            ]}
            onPress={onContinuar}
            disabled={!canContinue()}
          >
            <Text style={plantillasStyles.continueButtonText}>Continuar al Sorteo</Text>
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
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>{getTituloModal()}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <VectorIcon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {(tipoPersonal === 'jugador' || tipoPersonal === 'libero' || tipoPersonal === 'staff') && (
              <View style={modalStyles.modalTabs}>
                <TouchableOpacity
                  style={[
                    modalStyles.modalTab,
                    modalTab === 'seleccionar' && [modalStyles.modalTabActive, { borderBottomColor: theme.primary }]
                  ]}
                  onPress={() => setModalTab('seleccionar')}
                >
                  <VectorIcon
                    name="account-multiple"
                    size={22}
                    color={modalTab === 'seleccionar' ? theme.primary : '#64748b'}
                  />
                  <Text style={[
                    modalStyles.modalTabText,
                    modalTab === 'seleccionar' && [modalStyles.modalTabTextActive, { color: theme.primary }]
                  ]}>
                    {tipoPersonal === 'staff' ? 'Técnicos' : 'Plantilla'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    modalStyles.modalTab,
                    modalTab === 'nuevo' && [modalStyles.modalTabActive, { borderBottomColor: theme.primary }]
                  ]}
                  onPress={() => setModalTab('nuevo')}
                >
                  <VectorIcon
                    name="account-plus"
                    size={22}
                    color={modalTab === 'nuevo' ? theme.primary : '#64748b'}
                  />
                  <Text style={[
                    modalStyles.modalTabText,
                    modalTab === 'nuevo' && [modalStyles.modalTabTextActive, { color: theme.primary }]
                  ]}>
                    Nuevo
                  </Text>
                </TouchableOpacity>
                {tipoPersonal !== 'staff' && (
                  <TouchableOpacity
                    style={[
                      modalStyles.modalTab,
                      modalTab === 'otros' && [modalStyles.modalTabActive, { borderBottomColor: theme.primary }]
                    ]}
                    onPress={() => setModalTab('otros')}
                  >
                    <VectorIcon
                      name="account-search"
                      size={22}
                      color={modalTab === 'otros' ? theme.primary : '#64748b'}
                    />
                    <Text style={[
                      modalStyles.modalTabText,
                      modalTab === 'otros' && [modalStyles.modalTabTextActive, { color: theme.primary }]
                    ]}>
                      Otros
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {modalTab === 'seleccionar' && (tipoPersonal === 'jugador' || tipoPersonal === 'libero') ? (
              <JugadoresDisponiblesView
                jugadores={jugadoresDisponibles}
                onSelect={handleSelectJugador}
                onAddAll={handleAddAll}
                theme={theme}
                sortByName={sortByName}
              />
            ) : modalTab === 'seleccionar' && tipoPersonal === 'staff' ? (
              <StaffDisponiblesView
                staff={staffDisponibles}
                onSelect={handleSelectStaff}
                theme={theme}
                sortByName={sortByName}
              />
            ) : modalTab === 'otros' ? (
              <JugadoresDisponiblesView
                jugadores={otrosJugadores}
                onSelect={handleSelectJugador}
                onAddAll={handleAddAll}
                theme={theme}
                sortByName={sortByName}
              />
            ) : (
              <>
                <ScrollView 
                  style={modalStyles.modalBody}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ gap: 20, paddingBottom: 80 }}
                >
                  {(tipoPersonal === 'jugador' || tipoPersonal === 'libero') && (
                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Número *</Text>
                      <TextInput
                        style={modalStyles.input}
                        value={formData.dorsal}
                        onChangeText={(text) => setFormData({ ...formData, dorsal: text })}
                        placeholder="Número de dorsal"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                      />
                    </View>
                  )}

                  <View style={modalStyles.inputGroup}>
                    <Text style={modalStyles.inputLabel}>Apellidos *</Text>
                    <TextInput
                      style={modalStyles.input}
                      value={formData.apellidos}
                      onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
                      placeholder="Introduce los apellidos"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={modalStyles.inputGroup}>
                    <Text style={modalStyles.inputLabel}>Nombre *</Text>
                    <TextInput
                      style={modalStyles.input}
                      value={formData.nombre}
                      onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                      placeholder="Introduce el nombre"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={modalStyles.inputGroup}>
                    <Text style={modalStyles.inputLabel}>DNI *</Text>
                    <TextInput
                      style={modalStyles.input}
                      value={formData.dni}
                      onChangeText={(text) => setFormData({ ...formData, dni: text })}
                      placeholder="12345678A"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {(tipoPersonal === 'jugador' || tipoPersonal === 'libero') && (
                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Categoría *</Text>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                      >
                        {(['miniBenjamin', 'Benjamin', 'Alevin', 'Infantil', 'Cadete', 'Juvenil', 'Junior', 'Senior', 'Master'] as Categoria[]).map((cat) => {
                          const labels: { [key in Categoria]: string } = {
                            miniBenjamin: 'Mini-Benj',
                            Benjamin: 'Benjamín',
                            Alevin: 'Alevín',
                            Infantil: 'Infantil',
                            Cadete: 'Cadete',
                            Juvenil: 'Juvenil',
                            Junior: 'Junior',
                            Senior: 'Senior',
                            Master: 'Master',
                          };
                          return (
                            <TouchableOpacity
                              key={cat}
                              style={[
                                modalStyles.categoriaChip,
                                categoriaJugador === cat && { backgroundColor: theme.primary + '15', borderColor: theme.primary }
                              ]}
                              onPress={() => setCategoriaJugador(cat)}
                            >
                              <Text style={[
                                modalStyles.categoriaChipText,
                                categoriaJugador === cat && { color: theme.primary, fontWeight: '700' }
                              ]}>{labels[cat]}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {tipoPersonal === 'staff' && (
                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Rol *</Text>
                      <View style={modalStyles.rolSelector}>
                        <TouchableOpacity
                          style={[
                            modalStyles.rolOption,
                            rolStaff === 'entrenador' && [modalStyles.rolOptionActive, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]
                          ]}
                          onPress={() => setRolStaff('entrenador')}
                        >
                          <VectorIcon name="clipboard-account" size={20} color={rolStaff === 'entrenador' ? theme.primary : '#64748b'} />
                          <Text style={[
                            modalStyles.rolOptionText,
                            rolStaff === 'entrenador' && { color: theme.primary, fontWeight: '700' }
                          ]}>Entrenador</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            modalStyles.rolOption,
                            rolStaff === 'delegado' && [modalStyles.rolOptionActive, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]
                          ]}
                          onPress={() => setRolStaff('delegado')}
                        >
                          <VectorIcon name="account-tie" size={20} color={rolStaff === 'delegado' ? theme.primary : '#64748b'} />
                          <Text style={[
                            modalStyles.rolOptionText,
                            rolStaff === 'delegado' && { color: theme.primary, fontWeight: '700' }
                          ]}>Delegado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            modalStyles.rolOption,
                            rolStaff === 'entrenadorAsistente' && [modalStyles.rolOptionActive, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]
                          ]}
                          onPress={() => setRolStaff('entrenadorAsistente')}
                        >
                          <VectorIcon name="clipboard-account-outline" size={20} color={rolStaff === 'entrenadorAsistente' ? theme.primary : '#64748b'} />
                          <Text style={[
                            modalStyles.rolOptionText,
                            rolStaff === 'entrenadorAsistente' && { color: theme.primary, fontWeight: '700' }
                          ]}>Entrenador Asistente</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>

                <View style={modalStyles.modalFooter}>
                  <TouchableOpacity
                    style={modalStyles.modalCancelButton}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={modalStyles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modalStyles.modalConfirmButton, { backgroundColor: theme.primary }]}
                    onPress={handleAddPersonal}
                  >
                    <Text style={modalStyles.modalConfirmText}>Añadir</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
