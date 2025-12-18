export type Partido = {
  id: string;
  numeroPartido: string;
  fecha: string;
  hora: string;
  lugar: string;
  competicion: string;
  categoria: Categoria;
  equipoLocal: string;
  equipoVisitante: string;
  arbitro1: string;
  arbitro2: string;
  arbitro3: string;
  observaciones?: string;
  jugadoresDisponiblesLocal?: Jugador[];
  jugadoresDisponiblesVisitante?: Jugador[];
  staffDisponibleLocal?: StaffMember[];
  staffDisponibleVisitante?: StaffMember[];
};

export type Categoria = 'miniBenjamin' | 'Benjamin' | 'Alevin' | 'Infantil' | 'Cadete' | 'Juvenil' | 'Junior' | 'Senior' | 'Master';

export type Jugador = {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  dorsal?: string;
  esCapitan?: boolean;
  categoria?: Categoria;
};

export type StaffMember = {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  rol?: 'entrenador' | 'delegado' | 'entrenadorAsistente';
};

// ========================================
// JUGADORES Y STAFF - Definidos primero
// ========================================

// Jugadores de ejemplo para CV Teruel
export const JUGADORES_CV_TERUEL: Jugador[] = [
  { id: '1', nombre: 'Pablo', apellidos: 'Bugallo Sánchez', dni: '12345678A', dorsal: '1', categoria: 'Senior' },
  { id: '2', nombre: 'Adrián', apellidos: 'García Roca', dni: '23456789B', dorsal: '4', categoria: 'Senior' },
  { id: '3', nombre: 'Javier', apellidos: 'Jiménez Arenas', dni: '34567890C', dorsal: '5', categoria: 'Juvenil' },
  { id: '4', nombre: 'Andrés', apellidos: 'Villena Ruiz', dni: '45678901D', dorsal: '7', categoria: 'Senior' },
  { id: '5', nombre: 'Jorge', apellidos: 'Almansa Torres', dni: '56789012E', dorsal: '9', categoria: 'Junior' },
  { id: '6', nombre: 'Miguel', apellidos: 'Sáez Llorente', dni: '67890123F', dorsal: '11', categoria: 'Senior' },
  { id: '7', nombre: 'Daniel', apellidos: 'Gómez Pascual', dni: '78901234G', dorsal: '13', categoria: 'Juvenil' },
  { id: '8', nombre: 'Carlos', apellidos: 'Vicente López', dni: '89012345H', dorsal: '14', categoria: 'Senior' },
  { id: '9', nombre: 'Sergio', apellidos: 'Martín Ramírez', dni: '90123456I', dorsal: '3', categoria: 'Senior' },
  { id: '10', nombre: 'Raúl', apellidos: 'Díaz Fernández', dni: '01234567J', dorsal: '6', categoria: 'Juvenil' },
];

export const STAFF_CV_TERUEL: StaffMember[] = [
  { id: 's1', nombre: 'José Manuel', apellidos: 'Fernández Gómez', dni: '11234567K', rol: 'entrenador' },
  { id: 's2', nombre: 'Alberto', apellidos: 'Sánchez Ruiz', dni: '22345678L', rol: 'entrenadorAsistente' },
  { id: 's3', nombre: 'Francisco', apellidos: 'López Martín', dni: '33456789M', rol: 'delegado' },
  { id: 's4', nombre: 'Laura', apellidos: 'García Pérez', dni: '44567890N', rol: 'entrenadorAsistente' },
];

// Jugadores de ejemplo para Unicaja Almería
export const JUGADORES_UNICAJA_ALMERIA: Jugador[] = [
  { id: '11', nombre: 'Mario', apellidos: 'Hernández Silva', dni: '55678901O', dorsal: '2', categoria: 'Senior' },
  { id: '12', nombre: 'Óscar', apellidos: 'Novillo Torres', dni: '66789012P', dorsal: '8', categoria: 'Senior' },
  { id: '13', nombre: 'Iván', apellidos: 'Castellano Ruiz', dni: '77890123Q', dorsal: '10', categoria: 'Junior' },
  { id: '14', nombre: 'Rubén', apellidos: 'Hernández Díaz', dni: '88901234R', dorsal: '12', categoria: 'Senior' },
  { id: '15', nombre: 'Alejandro', apellidos: 'Vigil Cardona', dni: '99012345S', dorsal: '15', categoria: 'Juvenil' },
  { id: '16', nombre: 'Fernando', apellidos: 'López García', dni: '10123456T', dorsal: '17', categoria: 'Senior' },
  { id: '17', nombre: 'David', apellidos: 'Martínez Soto', dni: '21234567U', dorsal: '18', categoria: 'Senior' },
  { id: '18', nombre: 'Antonio', apellidos: 'Sánchez Morales', dni: '32345678V', dorsal: '16', categoria: 'Senior' },
  { id: '19', nombre: 'Manuel', apellidos: 'Rodríguez Pérez', dni: '43456789W', dorsal: '19', categoria: 'Juvenil' },
];

export const STAFF_UNICAJA_ALMERIA: StaffMember[] = [
  { id: 's5', nombre: 'Manolo', apellidos: 'Berenguel Martínez', dni: '54567890X', rol: 'entrenador' },
  { id: 's6', nombre: 'Jesús', apellidos: 'García Sánchez', dni: '65678901Y', rol: 'entrenadorAsistente' },
  { id: 's7', nombre: 'Rafael', apellidos: 'Ruiz López', dni: '76789012Z', rol: 'delegado' },
  { id: 's8', nombre: 'Patricia', apellidos: 'Martínez Gómez', dni: '87890123A', rol: 'entrenadorAsistente' },
];

// Jugadores de ejemplo para Arenal Emevé
export const JUGADORES_ARENAL_EMEVE: Jugador[] = [
  { id: '20', nombre: 'Tomás', apellidos: 'Mulet Pons', dni: '98901234B', dorsal: '1', categoria: 'Cadete' },
  { id: '21', nombre: 'Mateo', apellidos: 'Vidal Riera', dni: '09012345C', dorsal: '3', categoria: 'Cadete' },
  { id: '22', nombre: 'Gabriel', apellidos: 'Soler Mas', dni: '10123456D', dorsal: '5', categoria: 'Juvenil' },
  { id: '23', nombre: 'Marc', apellidos: 'Oliver Ferrer', dni: '21234567E', dorsal: '7', categoria: 'Cadete' },
  { id: '24', nombre: 'Pol', apellidos: 'Bestard Coll', dni: '32345678F', dorsal: '9', categoria: 'Cadete' },
  { id: '25', nombre: 'Guillem', apellidos: 'Carbonell Serra', dni: '43456789G', dorsal: '11', categoria: 'Juvenil' },
  { id: '26', nombre: 'Joan', apellidos: 'Adrover Martorell', dni: '54567890H', dorsal: '4', categoria: 'Cadete' },
];

export const STAFF_ARENAL_EMEVE: StaffMember[] = [
  { id: 's9', nombre: 'Miquel', apellidos: 'Roca Rosselló', dni: '65678901I', rol: 'entrenador' },
  { id: 's10', nombre: 'Antoni', apellidos: 'Barceló Llull', dni: '76789012J', rol: 'delegado' },
];

// Jugadores de ejemplo para CV Palma
export const JUGADORES_CV_PALMA: Jugador[] = [
  { id: '27', nombre: 'Clara', apellidos: 'Martínez Ruiz', dni: '87890123K', dorsal: '2', categoria: 'Senior' },
  { id: '28', nombre: 'Marta', apellidos: 'García López', dni: '98901234L', dorsal: '4', categoria: 'Junior' },
  { id: '29', nombre: 'Paula', apellidos: 'Sánchez Torres', dni: '09012345M', dorsal: '6', categoria: 'Senior' },
  { id: '30', nombre: 'Andrea', apellidos: 'Fernández Díaz', dni: '10123456N', dorsal: '8', categoria: 'Juvenil' },
  { id: '31', nombre: 'Lucía', apellidos: 'Rodríguez Pérez', dni: '21234567O', dorsal: '10', categoria: 'Senior' },
  { id: '32', nombre: 'Sara', apellidos: 'López Martín', dni: '32345678P', dorsal: '12', categoria: 'Senior' },
  { id: '33', nombre: 'Elena', apellidos: 'González Vega', dni: '43456789Q', dorsal: '14', categoria: 'Junior' },
  { id: '34', nombre: 'Sofía', apellidos: 'Morales Sánchez', dni: '54567890R', dorsal: '5', categoria: 'Senior' },
  { id: '35', nombre: 'Carmen', apellidos: 'Jiménez García', dni: '65678901S', dorsal: '7', categoria: 'Juvenil' },
];

export const STAFF_CV_PALMA: StaffMember[] = [
  { id: 's11', nombre: 'María', apellidos: 'Hernández Silva', dni: '76789012T', rol: 'entrenador' },
  { id: 's12', nombre: 'Isabel', apellidos: 'Ruiz Gómez', dni: '87890123U', rol: 'entrenadorAsistente' },
  { id: 's13', nombre: 'Ana', apellidos: 'Martínez Pérez', dni: '98901234V', rol: 'entrenadorAsistente' },
];

// ========================================
// PARTIDOS - Usar jugadores ya definidos
// ========================================

// Partidos de ejemplo - Voleibol España
export const PARTIDOS_CONFIRMADOS: Partido[] = [
  {
    id: '1',
    numeroPartido: 'P-2025-0147',
    fecha: '15/12/2025',
    hora: '18:00',
    lugar: 'Polideportivo Municipal Sant Jordi',
    competicion: 'Superliga Masculina',
    categoria: 'Senior',
    equipoLocal: 'CV Teruel',
    equipoVisitante: 'Unicaja Almería',
    arbitro1: 'Juan Pérez García',
    arbitro2: 'María García López',
    arbitro3: 'Carlos López Martínez',
    jugadoresDisponiblesLocal: [],
    jugadoresDisponiblesVisitante: [],
    staffDisponibleLocal: [],
    staffDisponibleVisitante: [],
  },
  {
    id: '2',
    numeroPartido: 'P-2025-0148',
    fecha: '16/12/2025',
    hora: '20:30',
    lugar: 'Pabellón de Son Moix',
    competicion: 'Superliga 2 Masculina',
    categoria: 'Cadete',
    equipoLocal: 'Arenal Emevé',
    equipoVisitante: 'Río Duero Soria',
    arbitro1: 'Juan Pérez García',
    arbitro2: 'Ana Martínez Ruiz',
    arbitro3: 'Luis Fernández Díaz',
    jugadoresDisponiblesLocal: [],
    jugadoresDisponiblesVisitante: [],
    staffDisponibleLocal: [],
    staffDisponibleVisitante: [],
  },
];

export const PARTIDOS_PROPUESTOS: Partido[] = [
  {
    id: '3',
    numeroPartido: 'P-2025-0149',
    fecha: '18/12/2025',
    hora: '19:00',
    lugar: 'Centro Deportivo Es Fortí',
    competicion: 'Superliga Femenina',
    categoria: 'Senior',
    equipoLocal: 'CV Palma',
    equipoVisitante: 'Feel Volley Alcobendas',
    arbitro1: 'Juan Pérez García',
    arbitro2: 'Pedro Sánchez Ruiz',
    arbitro3: 'Laura Ruiz González',
    jugadoresDisponiblesLocal: [],
    jugadoresDisponiblesVisitante: [],
    staffDisponibleLocal: [],
    staffDisponibleVisitante: [],
  },
  {
    id: '4',
    numeroPartido: 'P-2025-0150',
    fecha: '20/12/2025',
    hora: '17:30',
    lugar: 'Polideportivo Can Capó',
    competicion: 'Primera División Masculina',
    categoria: 'Juvenil',
    equipoLocal: 'Manacor Artesania',
    equipoVisitante: 'CV Ibiza',
    arbitro1: 'Juan Pérez García',
    arbitro2: 'Carmen Díaz Torres',
    arbitro3: 'Roberto Jiménez Vega',
    jugadoresDisponiblesLocal: [],
    jugadoresDisponiblesVisitante: [],
    staffDisponibleLocal: [],
    staffDisponibleVisitante: [],
  },
];
