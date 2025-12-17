import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import VectorIcon from '../../../components/VectorIcon';
import { StaffMember } from '../../../types/MockData';
import { jugadoresDisponiblesStyles as styles } from '../styles/PlantillasStyles';

type StaffDisponiblesViewProps = {
  staff: StaffMember[];
  onSelect: (staff: StaffMember, rol: 'entrenador' | 'delegado' | 'entrenadorAsistente') => void;
  theme: any;
  sortByName: <T extends { apellidos: string; nombre: string }>(list: T[]) => T[];
};

export function StaffDisponiblesView({ 
  staff, 
  onSelect, 
  theme,
  sortByName 
}: StaffDisponiblesViewProps) {
  const [rolSeleccionado, setRolSeleccionado] = useState<{ [key: string]: 'entrenador' | 'delegado' | 'entrenadorAsistente' }>({});

  if (staff.length === 0) {
    return (
      <View style={styles.emptyJugadores}>
        <VectorIcon name="account-off" size={48} color="#cbd5e1" />
        <Text style={styles.emptyJugadoresText}>
          No hay técnicos disponibles en la plantilla del equipo
        </Text>
        <Text style={styles.emptyJugadoresSubtext}>
          Puedes añadir un nuevo técnico en la pestaña "Añadir Nuevo"
        </Text>
      </View>
    );
  }

  const handleConfirmarSeleccion = (member: StaffMember) => {
    const rol = rolSeleccionado[member.id] || 'entrenador';
    onSelect(member, rol);
  };

  const staffOrdenado = sortByName(staff);

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
    <ScrollView style={styles.jugadoresDisponiblesList} showsVerticalScrollIndicator={false}>
      <View style={styles.jugadoresDisponiblesHeader}>
        <Text style={styles.jugadoresDisponiblesTitle}>
          Selecciona un técnico de la plantilla
        </Text>
        <Text style={styles.jugadoresDisponiblesSubtitle}>
          {staff.length} técnico{staff.length !== 1 ? 's' : ''} disponible{staff.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {staffOrdenado.map((member) => {
        const rolActual = rolSeleccionado[member.id] || 'entrenador';

        const roleShort: { [key: string]: string } = {
          entrenador: '1E',
          delegado: 'D',
          entrenadorAsistente: 'EA',
        };

        return (
          <Card key={member.id} style={styles.jugadorDisponibleCard} mode="elevated">
            <Card.Content style={styles.jugadorDisponibleContent}>
              <View style={styles.jugadorDisponibleInfo}>
                <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: theme.primary + '15' }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: theme.primary }}>{roleShort[rolActual]}</Text>
                </View>
                <View style={[styles.jugadorDisponibleDetails, { marginBottom: 0 }]}>
                  <Text style={styles.jugadorDisponibleNombre}>
                    {member.apellidos}, {member.nombre}
                  </Text>
                  <Text style={styles.jugadorDisponibleDNI}>DNI: {member.dni}</Text>
                </View>
              </View>
              
              {/* Selector de rol */}
              <View style={{ marginBottom: 12, gap: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>Seleccionar rol:</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: rolActual === 'entrenador' ? theme.primary : '#e2e8f0',
                        backgroundColor: rolActual === 'entrenador' ? theme.primary + '15' : '#f8fafc',
                        gap: 6,
                      }
                    ]}
                    onPress={() => setRolSeleccionado({ ...rolSeleccionado, [member.id]: 'entrenador' })}
                  >
                    <VectorIcon 
                      name={rolesIcons.entrenador} 
                      size={16} 
                      color={rolActual === 'entrenador' ? theme.primary : '#64748b'} 
                    />
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: rolActual === 'entrenador' ? theme.primary : '#64748b'
                    }}>
                      Entrenador
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: rolActual === 'delegado' ? theme.primary : '#e2e8f0',
                        backgroundColor: rolActual === 'delegado' ? theme.primary + '15' : '#f8fafc',
                        gap: 6,
                      }
                    ]}
                    onPress={() => setRolSeleccionado({ ...rolSeleccionado, [member.id]: 'delegado' })}
                  >
                    <VectorIcon 
                      name={rolesIcons.delegado} 
                      size={16} 
                      color={rolActual === 'delegado' ? theme.primary : '#64748b'} 
                    />
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: rolActual === 'delegado' ? theme.primary : '#64748b'
                    }}>
                      Delegado
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: rolActual === 'entrenadorAsistente' ? theme.primary : '#e2e8f0',
                      backgroundColor: rolActual === 'entrenadorAsistente' ? theme.primary + '15' : '#f8fafc',
                      gap: 6,
                    }
                  ]}
                  onPress={() => setRolSeleccionado({ ...rolSeleccionado, [member.id]: 'entrenadorAsistente' })}
                >
                  <VectorIcon 
                    name={rolesIcons.entrenadorAsistente} 
                    size={16} 
                    color={rolActual === 'entrenadorAsistente' ? theme.primary : '#64748b'} 
                  />
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: rolActual === 'entrenadorAsistente' ? theme.primary : '#64748b'
                  }}>
                    Entrenador Asistente
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.jugadorSeleccionarButton, { backgroundColor: theme.primary, alignSelf: 'flex-end' }]}
                onPress={() => handleConfirmarSeleccion(member)}
              >
                <VectorIcon name="check" size={20} color="#ffffff" />
                <Text style={styles.jugadorSeleccionarText}>Añadir</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        );
      })}
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
