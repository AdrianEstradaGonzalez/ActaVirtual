# 🌍 Sistema Multi-Comunidad - AlignMe

## 📋 Descripción

AlignMe ahora soporta múltiples comunidades autónomas con temas y assets personalizados. Actualmente incluye:
- 🔵 **Asturias** - AlignMe (FVBPA)
- 🟣 **Islas Baleares** - COTABAL LINE UP

## 🏗️ Arquitectura

### Estructura de archivos

```
AlignMe/
├── config/
│   ├── themes.ts          # Definición de temas por comunidad
│   └── assets.ts          # Mapeo de recursos por comunidad
├── context/
│   └── CommunityContext.tsx  # Context Provider + AsyncStorage
├── components/
│   └── CommunitySwitcher.tsx # Botón para cambiar comunidad
├── pages/
│   └── CommunitySelector.tsx # Pantalla de selección inicial
├── assets/
│   ├── asturias/
│   │   ├── bandera.png
│   │   └── logo_fvbpa.png
│   └── baleares/
│       ├── bandera.png
│       ├── HEADER_BALEAR.png
│       ├── LOGO_LETRAS.png
│       └── LogoPatrocinio.jpg
└── styles/
    └── AppStyles.ts      # Estilos dinámicos basados en tema
```

### Flujo de funcionamiento

1. **Inicio de la app**
   - `CommunityProvider` carga la comunidad guardada de AsyncStorage
   - Si no hay comunidad seleccionada → muestra `CommunitySelector`
   - Si hay comunidad → muestra la app normal con ese tema

2. **Selección de comunidad**
   - Usuario toca bandera en `CommunitySelector`
   - Se guarda en AsyncStorage
   - Se actualiza el Context
   - La app se re-renderiza con el nuevo tema

3. **Cambio de comunidad**
   - Usuario toca botón "🏳️ Cambiar Comunidad" (esquina superior izquierda)
   - Se limpia la comunidad guardada
   - Vuelve a aparecer el `CommunitySelector`

## 🎨 Cómo añadir una nueva comunidad

### 1. Definir el tema (`config/themes.ts`)

```typescript
// 1. Añadir el ID al tipo
export type CommunityId = 'asturias' | 'baleares' | 'galicia';

// 2. Crear el objeto de tema
export const GaliciaTheme: Theme = {
  id: 'galicia',
  name: 'Galicia',
  primary: "#1e40af",      // Azul
  secondary: "#059669",    // Verde
  accent: "#f59e0b",       // Naranja
  // ... resto de colores
};

// 3. Registrar en THEMES
export const THEMES: Record<CommunityId, Theme> = {
  asturias: AsturiasTheme,
  baleares: BalearesTheme,
  galicia: GaliciaTheme,  // ← Nueva comunidad
};
```

### 2. Configurar assets (`config/assets.ts`)

```typescript
// 1. Crear objeto de assets
const GaliciaAssets: CommunityAssets = {
  headerLogo: require('../assets/galicia/logo_header.png'),
  appLogo: require('../assets/258.png'),
  background: require('../assets/fondo.jpeg'),
  flag: require('../assets/galicia/bandera.png'),
  appTitle: 'VoleiGal',
};

// 2. Registrar en COMMUNITY_ASSETS
export const COMMUNITY_ASSETS: Record<CommunityId, CommunityAssets> = {
  asturias: AsturiasAssets,
  baleares: BalearesAssets,
  galicia: GaliciaAssets,  // ← Nueva comunidad
};
```

### 3. Añadir recursos (`assets/galicia/`)

Crear carpeta y añadir:
- `bandera.png` - Bandera de la comunidad (para selector)
- `logo_header.png` - Logo principal del header
- Otros logos/imágenes específicas (opcional)

### 4. Actualizar selector (`pages/CommunitySelector.tsx`)

Añadir nuevo `TouchableOpacity` para la nueva comunidad:

```tsx
<TouchableOpacity
  style={styles.flagCard}
  activeOpacity={0.8}
  onPress={() => handleSelect('galicia')}
>
  <View style={styles.flagImageContainer}>
    <Image
      source={require('../assets/galicia/bandera.png')}
      style={styles.flagImage}
      resizeMode="contain"
    />
  </View>
  <View style={styles.flagTextContainer}>
    <Text style={styles.flagName}>{THEMES.galicia.name}</Text>
    <Text style={styles.flagSubtext}>VoleiGal</Text>
  </View>
</TouchableOpacity>
```

### 5. Layout específico (opcional)

Si la nueva comunidad necesita un layout diferente (como Baleares con logos extras), actualizar `App.tsx`:

```tsx
// En HomeScreen
if (communityId === 'galicia') {
  return (
    // Layout personalizado para Galicia
  );
}
```

## 📦 Instalación y ejecución

```powershell
# Instalar dependencias (incluye AsyncStorage)
npm install

# Limpiar caché y reinstalar (si es necesario)
npm run start -- --reset-cache

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## 🔧 Uso del sistema

### Acceder al tema y assets en cualquier componente

```tsx
import { useCommunity } from './context/CommunityContext';

function MiComponente() {
  const { theme, assets, communityId } = useCommunity();
  
  // Usar theme
  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.primary,
      borderColor: theme.accent,
    }
  });
  
  // Usar assets
  return <Image source={assets.headerLogo} />;
}
```

### Cambiar comunidad programáticamente

```tsx
import { useCommunity } from './context/CommunityContext';

function Settings() {
  const { setCommunity, clearCommunity } = useCommunity();
  
  const cambiarABaleares = async () => {
    await setCommunity('baleares');
  };
  
  const resetear = async () => {
    await clearCommunity(); // Vuelve al selector
  };
}
```

## 🎯 Características del sistema

✅ **Persistencia automática** - La elección se guarda en AsyncStorage  
✅ **Temas centralizados** - Un solo archivo para todos los colores  
✅ **Assets organizados** - Carpetas separadas por comunidad  
✅ **Context API** - Estado global accesible desde cualquier componente  
✅ **Cambio dinámico** - Botón flotante para cambiar sin reiniciar  
✅ **Escalable** - Fácil añadir nuevas comunidades  
✅ **TypeScript** - Type-safe con autocompletado  

## 📱 Pantallas

1. **CommunitySelector** - Selección inicial con banderas
2. **HomeScreen** - Adapta layout según comunidad (Asturias vs Baleares)
3. **CommunitySwitcher** - Botón flotante en todas las pantallas

## 🐛 Troubleshooting

### La app no guarda la selección
- Verificar que AsyncStorage esté instalado: `npm list @react-native-async-storage/async-storage`
- Limpiar caché: `npm run start -- --reset-cache`

### Los colores no cambian
- Asegurarse de que `createAppStyles(theme)` se llama dentro del componente
- Verificar que el componente usa `useCommunity()` hook

### Imágenes no se muestran
- Verificar que las rutas en `config/assets.ts` sean correctas
- Asegurarse de que los archivos existan en `assets/{comunidad}/`

---

**Desarrollado por Adrián Estrada González - 2025**
