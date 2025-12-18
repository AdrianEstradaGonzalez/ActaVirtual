# Actualización del Acta Virtual - Nuevas Fases

## Cambios Implementados

### 1. Nueva Fase: Firmas
Se ha agregado una fase de firmas entre "Sorteo" y "Partido" donde deben firmar:
- Entrenador del equipo local
- Capitán del equipo local
- Entrenador del equipo visitante
- Capitán del equipo visitante

### 2. Fase de Sorteo Completa
Implementación de la selección de:
- Equipo que comienza sacando
- Lados de cancha para cada equipo (Lado A / Lado B)

### 3. Navegación Libre
- El indicador de fases ahora es completamente interactivo
- El árbitro puede navegar libremente entre todas las fases
- Se eliminó el botón "Continuar" de la vista de plantillas

### 4. Estructura de Fases Actualizada
1. **Plantillas** - Configuración de equipos
2. **Sorteo** - Selección de saque inicial y lados
3. **Firmas** - Recolección de firmas digitales
4. **Partido** - (Próximamente)
5. **Finalización** - (Próximamente)

## Instalación de Dependencias

Para que la funcionalidad de firmas funcione correctamente, es necesario instalar el paquete `react-native-signature-canvas`:

\`\`\`bash
cd ActaVirtual
npm install react-native-signature-canvas
\`\`\`

### Para iOS (adicional):
\`\`\`bash
cd ios
pod install
cd ..
\`\`\`

## Archivos Creados/Modificados

### Nuevos Archivos:
- `pages/actaFases/SorteoView.tsx` - Vista de sorteo
- `pages/actaFases/FirmasView.tsx` - Vista de firmas digitales
- `pages/actaFases/styles/SorteoStyles.ts` - Estilos de sorteo
- `pages/actaFases/styles/FirmasStyles.ts` - Estilos de firmas
- `pages/actaVirtual/styles/ActaVirtualStyles.ts` - Estilos de acta virtual (movido)

### Archivos Modificados:
- `pages/actaVirtual/ActaVirtualView.tsx` - Navegación y fases actualizadas
- `pages/actaFases/PlantillasView.tsx` - Eliminado botón continuar

## Características de las Nuevas Vistas

### SorteoView
- Selección visual de equipo que saca
- Asignación interactiva de lados de cancha
- Resumen de configuración completa
- Diseño profesional con tarjetas y radio buttons

### FirmasView
- 4 áreas de firma con canvas táctil
- Botones para limpiar y confirmar cada firma
- Barra de progreso visual
- Estados: sin firmar / firmado
- Guardado de firma en formato SVG

## Estilos

Todos los estilos están separados de la lógica en archivos independientes dentro de la carpeta `styles/`:
- Diseño moderno y profesional
- Uso de colores personalizados del tema
- Sombras y elevaciones para profundidad
- Diseño responsive y accesible

## Próximos Pasos

Una vez instaladas las dependencias, ejecutar:

\`\`\`bash
npm start
# En otra terminal
npm run android  # o npm run ios
\`\`\`
