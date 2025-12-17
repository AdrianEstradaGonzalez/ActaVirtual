import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import VectorIcon from '../../../components/VectorIcon';
import { Jugador, StaffMember, Categoria } from '../../../types/MockData';
import { cardStyles as styles } from '../styles/PlantillasStyles';

type PersonalCardProps = {
  person: Jugador | StaffMember;
  tipo: 'jugador' | 'libero' | 'staff';
  theme: any;
  showDorsal?: boolean;
  onToggleCapitan?: (id: string, esJugador: boolean) => void;
  onRemove: (tipo: 'jugador' | 'libero' | 'staff', id: string) => void;
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

export function PersonalCard({ 
  person, 
  tipo, 
  theme, 
  showDorsal = false,
  onToggleCapitan,
  onRemove 
}: PersonalCardProps) {
  const esJugador = 'dorsal' in person;
  const esCapitan = esJugador && person.esCapitan;
  const categoria = esJugador && person.categoria;

  return (
    <Card style={styles.personalCard} mode="elevated">
      <Card.Content style={styles.personalCardContent}>
        <View style={styles.personalInfo}>
          {showDorsal && 'dorsal' in person && person.dorsal && (
            <View style={[styles.dorsalBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.dorsalText}>{person.dorsal}</Text>
            </View>
          )}
          <View style={styles.personalDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.personalName}>
                {person.apellidos}, {person.nombre}
              </Text>
              {/* Small captain badge removed: captain indicated via action button */}
            </View>
            <View style={styles.dniRow}>
              <Text style={styles.personalDni}>DNI: {person.dni}</Text>
              {categoria && (
                <View style={styles.categoriaBadge}>
                  <Text style={styles.categoriaText}>{categoriasNombres[categoria]}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          {esJugador && (tipo === 'jugador' || tipo === 'libero') && onToggleCapitan && (
            <TouchableOpacity
              style={[
                styles.capitanButton,
                esCapitan && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => onToggleCapitan(person.id, tipo === 'jugador')}
            >
              <Text style={[
                styles.capitanButtonText,
                esCapitan && styles.capitanButtonTextActive
              ]}>
                C
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(tipo, person.id)}
          >
            <VectorIcon name="delete" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}

type StaffCardProps = {
  member: StaffMember;
  theme: any;
  onRemove: (tipo: 'staff', id: string) => void;
};

export function StaffCard({ member, theme, onRemove }: StaffCardProps) {
  const rolesIcons = {
    entrenador: 'clipboard-account',
    entrenadorAsistente: 'clipboard-account-outline',
    delegado: 'account-tie',
  };

  const rolesNombres = {
    entrenador: 'Entrenador',
    entrenadorAsistente: 'Entrenador Asistente',
    delegado: 'Delegado',
  };

  return (
    <Card style={styles.personalCard} mode="elevated">
      <Card.Content style={styles.personalCardContent}>
        <View style={styles.personalInfo}>
          {/* role short badge */}
          <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: theme.primary + '15' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: theme.primary }}>{(function(){
              const roleShort: { [key: string]: string } = { entrenador: '1E', delegado: 'D', entrenadorAsistente: 'EA' };
              return member.rol ? roleShort[member.rol] : roleShort['entrenadorAsistente'];
            })()}</Text>
          </View>
          <View style={styles.personalDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.personalName}>
                {member.apellidos}, {member.nombre}
              </Text>
            </View>
            <Text style={styles.personalDni}>DNI: {member.dni}</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove('staff', member.id)}
          >
            <VectorIcon name="delete" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}
