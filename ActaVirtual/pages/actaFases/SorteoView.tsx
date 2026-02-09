import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import { Partido } from '../../types/MockData';
import { styles } from './styles/SorteoStyles';
import VectorIcon from '../../components/VectorIcon';

const swapIcon = require('../../assets/icons/swap.png');

type SorteoViewProps = {
  partido: Partido;
};

export default function SorteoView({ partido }: SorteoViewProps) {
  const { theme } = useCommunity();
  const [equipoQueSaca, setEquipoQueSaca] = useState<'local' | 'visitante' | null>(null);
  const [ladosSwapped, setLadosSwapped] = useState(false);

  if (!theme) {
    return null;
  }

  const handleSelectSaque = (equipo: 'local' | 'visitante') => {
    setEquipoQueSaca(equipo);
  };

  const handleSwapLados = () => {
    setLadosSwapped(!ladosSwapped);
  };

  const equipoLadoA = ladosSwapped ? partido.equipoVisitante : partido.equipoLocal;
  const equipoLadoB = ladosSwapped ? partido.equipoLocal : partido.equipoVisitante;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Configuración del Partido</Text>

      {/* Selección de saque inicial */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>¿Qué equipo comienza sacando?</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              equipoQueSaca === 'local' && [
                styles.optionButtonSelected,
                { borderColor: theme.primary },
              ],
            ]}
            onPress={() => handleSelectSaque('local')}
          >
            <View
              style={[
                styles.optionCircle,
                equipoQueSaca === 'local' && [
                  styles.optionCircleSelected,
                  { borderColor: theme.primary },
                ],
              ]}
            >
              {equipoQueSaca === 'local' && (
                <View style={[styles.optionCircleInner, { backgroundColor: theme.primary }]} />
              )}
            </View>
            <Text
              style={[
                styles.optionText,
                equipoQueSaca === 'local' && styles.optionTextSelected,
              ]}
            >
              {partido.equipoLocal}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              equipoQueSaca === 'visitante' && [
                styles.optionButtonSelected,
                { borderColor: theme.primary },
              ],
            ]}
            onPress={() => handleSelectSaque('visitante')}
          >
            <View
              style={[
                styles.optionCircle,
                equipoQueSaca === 'visitante' && [
                  styles.optionCircleSelected,
                  { borderColor: theme.primary },
                ],
              ]}
            >
              {equipoQueSaca === 'visitante' && (
                <View style={[styles.optionCircleInner, { backgroundColor: theme.primary }]} />
              )}
            </View>
            <Text
              style={[
                styles.optionText,
                equipoQueSaca === 'visitante' && styles.optionTextSelected,
              ]}
            >
              {partido.equipoVisitante}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selección de lados */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selección de campo</Text>    
        {/* Mini campo de voleibol */}
        <View style={styles.miniCampo}>
          {/* Equipo izquierdo (Lado A) */}
          <View style={styles.ladoEquipo}>
            <Text style={styles.ladoNombre}>{equipoLadoA}</Text>
          </View>

          {/* Red del medio */}
          <View style={styles.redContainer}>
            <View style={styles.red} />
            {/* Botón swap centrado sobre la red */}
            <TouchableOpacity 
              style={[styles.swapButton, { backgroundColor: theme.primary }]}
              onPress={handleSwapLados}
            >
              <Image 
                source={swapIcon}
                style={{ width: 24, height: 24, tintColor: '#ffffff' }}
              />
            </TouchableOpacity>
          </View>

          {/* Equipo derecho (Lado B) */}
          <View style={styles.ladoEquipo}>
            <Text style={styles.ladoNombre}>{equipoLadoB}</Text>
          </View>
        </View>
      </View>

      {/* Resumen */}
      {equipoQueSaca && (
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <VectorIcon name="check" size={16} color="#065f46" />
            <Text style={styles.summaryTitle}>Configuración Completa</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Saque inicial:</Text>
            <Text style={styles.summaryValue}>
              {equipoQueSaca === 'local' ? partido.equipoLocal : partido.equipoVisitante}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lado A:</Text>
            <Text style={styles.summaryValue}>{equipoLadoA}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>Lado B:</Text>
            <Text style={styles.summaryValue}>{equipoLadoB}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
