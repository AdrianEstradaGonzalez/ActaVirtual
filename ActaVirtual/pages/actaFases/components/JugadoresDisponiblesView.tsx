import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, Card } from 'react-native-paper';
import VectorIcon from '../../../components/VectorIcon';
import { Jugador, Categoria } from '../../../types/MockData';
import { jugadoresDisponiblesStyles as styles } from '../styles/PlantillasStyles';

type JugadoresDisponiblesViewProps = {
  jugadores: Jugador[];
  onSelect: (jugador: Jugador, dorsal: string, esCapitan: boolean, esLibero: boolean) => void;
  theme: any;
  sortByName: <T extends { apellidos: string; nombre: string }>(list: T[]) => T[];
  onAddAll?: (items: { jugador: Jugador; dorsal: string; esCapitan: boolean; esLibero: boolean }[]) => void;
};

const categoriasNombres: { [key in Categoria]: string } = {
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

export function JugadoresDisponiblesView({ 
  jugadores, 
  onSelect, 
  theme,
  sortByName,
  onAddAll,
}: JugadoresDisponiblesViewProps) {
  const [dorsalSeleccionado, setDorsalSeleccionado] = useState<{ [key: string]: string }>({});
  const [capitanId, setCapitanId] = useState<string | null>(null);
  const [liberoSeleccionado, setLiberoSeleccionado] = useState<{ [key: string]: boolean }>({});

  if (jugadores.length === 0) {
    return (
      <View style={styles.emptyJugadores}>
        <VectorIcon name="account-off" size={48} color="#cbd5e1" />
        <Text style={styles.emptyJugadoresText}>
          No hay jugadores disponibles en la plantilla del equipo
        </Text>
        <Text style={styles.emptyJugadoresSubtext}>
          Puedes añadir un nuevo jugador en la pestaña "Añadir Nuevo"
        </Text>
      </View>
    );
  }

  const handleConfirmarSeleccion = (jugador: Jugador) => {
    const dorsal = Object.prototype.hasOwnProperty.call(dorsalSeleccionado, jugador.id)
      ? dorsalSeleccionado[jugador.id]
      : (jugador.dorsal ?? '');
    const esCapitan = capitanId === jugador.id;
    const esLibero = !!liberoSeleccionado[jugador.id];
    onSelect(jugador, dorsal, esCapitan, esLibero);
  };

  const jugadoresOrdenados = sortByName(jugadores);

  return (
    <ScrollView style={styles.jugadoresDisponiblesList} showsVerticalScrollIndicator={false}>
      <View style={styles.jugadoresDisponiblesHeader}>
        <Text style={styles.jugadoresDisponiblesTitle}>
          Selecciona un jugador de la plantilla
        </Text>
        <Text style={styles.jugadoresDisponiblesSubtitle}>
          {jugadores.length} jugador{jugadores.length !== 1 ? 'es' : ''} disponible{jugadores.length !== 1 ? 's' : ''}
        </Text>
        {onAddAll && jugadores.length > 0 && (
          <TouchableOpacity
            style={[styles.jugadorSeleccionarButton, { backgroundColor: theme.primary, alignSelf: 'flex-end', marginTop: 8 }]}
            onPress={() => {
              const items = jugadoresOrdenados.map(j => {
                const dorsal = Object.prototype.hasOwnProperty.call(dorsalSeleccionado, j.id)
                  ? dorsalSeleccionado[j.id]
                  : (j.dorsal || '');
                const esLibero = !!liberoSeleccionado[j.id];
                return { jugador: j, dorsal, esCapitan: false, esLibero };
              });
              onAddAll(items);
            }}
          >
            <VectorIcon name="account-multiple" size={18} color="#ffffff" />
            <Text style={[styles.jugadorSeleccionarText, { marginLeft: 8 }]}>Añadir todos</Text>
          </TouchableOpacity>
        )}
      </View>

      {jugadoresOrdenados.map((jugador) => {
        const esCapitanActual = capitanId === jugador.id;
        const dorsalActual = Object.prototype.hasOwnProperty.call(dorsalSeleccionado, jugador.id)
          ? dorsalSeleccionado[jugador.id]
          : (jugador.dorsal || '');
        const esLiberoActual = !!liberoSeleccionado[jugador.id];
        
        return (
          <Card key={jugador.id} style={styles.jugadorDisponibleCard} mode="elevated">
            <Card.Content style={styles.jugadorDisponibleContent}>
              <View style={styles.jugadorDisponibleInfo}>
                <View style={styles.jugadorDisponibleDorsalContainer}>
                  <TextInput
                    style={[styles.jugadorDisponibleDorsalInput, { borderColor: theme.primary }]}
                    value={dorsalActual}
                    onChangeText={(text) => setDorsalSeleccionado({ ...dorsalSeleccionado, [jugador.id]: text })}
                    placeholder="N°"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View style={styles.jugadorDisponibleDetails}>
                  <Text style={styles.jugadorDisponibleNombre}>
                    {jugador.apellidos}, {jugador.nombre}
                  </Text>
                  <View style={styles.dniRow}>
                    <Text style={styles.jugadorDisponibleDNI}>DNI: {jugador.dni}</Text>
                    {jugador.categoria && (
                      <View style={styles.categoriaBadge}>
                        <Text style={styles.categoriaText}>{categoriasNombres[jugador.categoria]}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              <View style={styles.jugadorDisponibleActions}>
                <TouchableOpacity
                  style={[
                    styles.jugadorCapitanButton,
                    esLiberoActual && { backgroundColor: theme.secondary, borderColor: theme.secondary }
                  ]}
                  onPress={() => setLiberoSeleccionado({ ...liberoSeleccionado, [jugador.id]: !esLiberoActual })}
                >
                  <Text style={[
                    styles.capitanButtonText,
                    esLiberoActual && { color: '#ffffff' }
                  ]}>
                    L
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.jugadorCapitanButton,
                    esCapitanActual && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setCapitanId(esCapitanActual ? null : jugador.id)}
                >
                  <Text style={[
                    styles.capitanButtonText,
                    esCapitanActual && styles.capitanButtonTextActive
                  ]}>
                    C
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.jugadorSeleccionarButton, { backgroundColor: theme.primary }]}
                  onPress={() => handleConfirmarSeleccion(jugador)}
                >
                  <VectorIcon name="check" size={20} color="#ffffff" />
                  <Text style={styles.jugadorSeleccionarText}>Añadir</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        );
      })}
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
