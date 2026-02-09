import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import { Partido } from '../../types/MockData';
import { styles } from './styles/FirmasStyles';
import SignatureCanvas from '../../components/SignatureCanvas';
import VectorIcon from '../../components/VectorIcon';

type FirmasViewProps = {
  partido: Partido;
};

type FirmaState = {
  signed: boolean;
  signature?: string;
};

export default function FirmasView({ partido }: FirmasViewProps) {
  const { theme } = useCommunity();
  const signatureRefs = useRef<{ [key: string]: any }>({});
  
  // Solo guardamos el estado de firmado, no los datos de las personas
  const [firmaStates, setFirmaStates] = useState<{ [key: string]: FirmaState }>({});

  if (!theme) {
    return null;
  }

  const getEntrenadorName = (staff: any[] | undefined) => {
    if (!staff || staff.length === 0) return null;
    // Prefer 'entrenador' then 'entrenadorAsistente'
    const principal = staff.find(s => s.rol === 'entrenador') || staff.find(s => s.rol === 'entrenadorAsistente');
    if (!principal) return null;
    return `${principal.nombre} ${principal.apellidos}`;
  };

  const getCapitanName = (jugadores: any[] | undefined) => {
    const capitan = jugadores?.find(j => j.esCapitan);
    if (!capitan) return null;
    return `${capitan.nombre} ${capitan.apellidos}`;
  };

  // Calculamos las firmas dinámicamente basadas en los datos actuales del partido
  const firmas = useMemo(() => [
    {
      id: 'capitan-local',
      role: 'Capitán',
      name: getCapitanName(partido.jugadoresDisponiblesLocal) || '',
      team: partido.equipoLocal,
      signed: firmaStates['capitan-local']?.signed || false,
      signature: firmaStates['capitan-local']?.signature,
    },
    {
      id: 'capitan-visitante',
      role: 'Capitán',
      name: getCapitanName(partido.jugadoresDisponiblesVisitante) || '',
      team: partido.equipoVisitante,
      signed: firmaStates['capitan-visitante']?.signed || false,
      signature: firmaStates['capitan-visitante']?.signature,
    },
    {
      id: 'entrenador-local',
      role: 'Entrenador',
      name: getEntrenadorName(partido.staffDisponibleLocal) || '',
      team: partido.equipoLocal,
      signed: firmaStates['entrenador-local']?.signed || false,
      signature: firmaStates['entrenador-local']?.signature,
    },
    {
      id: 'entrenador-visitante',
      role: 'Entrenador',
      name: getEntrenadorName(partido.staffDisponibleVisitante) || '',
      team: partido.equipoVisitante,
      signed: firmaStates['entrenador-visitante']?.signed || false,
      signature: firmaStates['entrenador-visitante']?.signature,
    },
  ], [partido, firmaStates]);

  const handleSignature = (id: string, signature: string) => {
    setFirmaStates(prev => ({
      ...prev,
      [id]: { signed: true, signature }
    }));
  };

  const handleClear = (id: string) => {
    signatureRefs.current[id]?.clearSignature();
    setFirmaStates(prev => ({
      ...prev,
      [id]: { signed: false, signature: undefined }
    }));
  };

  const handleEnd = (id: string) => {
    signatureRefs.current[id]?.readSignature();
  };

  const firmadasCount = firmas.filter(f => f.signed).length;
  const totalFirmas = firmas.length;
  const progress = (firmadasCount / totalFirmas) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerText}>
        Los entrenadores y capitanes de ambos equipos deben firmar antes del inicio del partido
      </Text>

      <View style={styles.firmasGrid}>
        {firmas.map((firma) => {
          const staffList = firma.team === partido.equipoLocal ? partido.staffDisponibleLocal : partido.staffDisponibleVisitante;
          const hasOnlyDelegado = !!(
            staffList &&
            staffList.length > 0 &&
            staffList.some(s => s.rol === 'delegado') &&
            !staffList.some(s => s.rol === 'entrenador' || s.rol === 'entrenadorAsistente')
          );
          const canSign = !(firma.role === 'Entrenador' && hasOnlyDelegado) && !!firma.name;

          return (
            <View key={firma.id} style={styles.firmaCard}>
              <View style={styles.firmaHeader}>
                <Text style={styles.firmaRole}>
                  {firma.role} - {firma.team}
                </Text>
                {firma.name ? (
                  <Text style={styles.firmaName}>{firma.name}</Text>
                ) : (
                  <View style={styles.alertContainer}>
                    <VectorIcon name="alert-circle" size={18} color="#ef4444" />
                    <Text style={styles.alertText}>
                      {firma.role === 'Entrenador' && hasOnlyDelegado
                        ? 'No hay entrenador con titulación (solo delegado disponible)'
                        : `No hay ${firma.role.toLowerCase()} registrado`}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.canvasContainer,
                  firma.signed && styles.canvasContainerSigned,
                ]}
              >
                {canSign ? (
                  <>
                    <SignatureCanvas
                      ref={(ref: any) => (signatureRefs.current[firma.id] = ref)}
                      onEnd={() => handleEnd(firma.id)}
                      onOK={(signature: string) => handleSignature(firma.id, signature)}
                      penColor="#0f172a"
                      disabled={firma.signed}
                    />
                    {!firma.signed && (
                      <View style={styles.emptyCanvasText} pointerEvents="none">
                        <Text style={styles.emptyText}>Toque para firmar</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.disabledCanvasPlaceholder}>
                    <Text style={styles.disabledCanvasText}>No disponible para firmar</Text>
                  </View>
                )}
              </View>

              {!firma.signed ? (
                canSign ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => handleClear(firma.id)}
                    >
                      <VectorIcon name="delete" size={14} color="#64748b" />
                      <Text style={styles.clearButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.signButton, { backgroundColor: theme.primary }]}
                      onPress={() => handleEnd(firma.id)}
                    >
                      <VectorIcon name="check" size={14} color="#ffffff" />
                      <Text style={styles.signButtonText}>Confirmar Firma</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>No disponible para firmar</Text>
                  </View>
                )
              ) : (
                <View style={styles.signedBadge}>
                  <VectorIcon name="check" size={14} color="#065f46" />
                  <Text style={styles.signedBadgeText}>Firmado</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Progreso de Firmas</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: theme.primary },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {firmadasCount} de {totalFirmas} firmas completadas
        </Text>
      </View>
    </ScrollView>
  );
}
