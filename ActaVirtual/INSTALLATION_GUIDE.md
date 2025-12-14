# 🚀 Guía de Instalación - Sistema Multi-Comunidad

## 📋 Pasos para probar el sistema

### 1. Instalar dependencias

```powershell
# Navegar al directorio del proyecto
cd c:\Projects\VLU\AlignMe

# Instalar AsyncStorage y demás dependencias
npm install

# Si ya tenías node_modules, mejor limpiar e instalar de nuevo
# Remove-Item -Recurse -Force node_modules
# npm install
```

### 2. Preparar assets de las comunidades

Asegúrate de tener estas imágenes en las carpetas correspondientes:

#### Asturias (`assets/asturias/`)
- ✅ `bandera.png` - Bandera de Asturias
- ✅ `logo_fvbpa.png` - Logo FVBPA

#### Baleares (`assets/baleares/`)
- ✅ `bandera.png` - Bandera de Islas Baleares
- ✅ `HEADER_BALEAR.png` - Header COTABAL
- ✅ `LOGO_LETRAS.png` - Logo esquina superior derecha
- ✅ `LogoPatrocinio.jpg` - Logo patrocinador

**IMPORTANTE**: Si no tienes las banderas, créalas temporalmente o descárgalas. El selector las necesita.

### 3. Limpiar caché de Metro

```powershell
# Limpiar caché de Metro bundler
npm run start -- --reset-cache
```

### 4. Ejecutar la app

#### En Android:
```powershell
# En una terminal, iniciar Metro
npm run start

# En otra terminal, ejecutar Android
npm run android
```

#### En iOS (si tienes Mac):
```powershell
# Instalar pods primero
cd ios
pod install
cd ..

# Ejecutar iOS
npm run ios
```

## 🧪 Cómo probar el sistema

### Primera ejecución
1. La app mostrará el **CommunitySelector** con dos banderas
2. Toca una bandera (Asturias o Baleares)
3. La app carga con el tema y assets de esa comunidad
4. La selección se guarda automáticamente

### Cambiar de comunidad
1. En cualquier pantalla, busca el botón **"🏳️ Cambiar Comunidad"** (esquina superior izquierda)
2. Tócalo
3. Volverás al selector de comunidades
4. Elige otra comunidad

### Cerrar y reabrir la app
1. Cierra completamente la app
2. Vuelve a abrirla
3. Debería recordar tu última selección y cargar directamente con ese tema

## 🎨 Qué esperar de cada comunidad

### 🔵 Asturias (AlignMe)
- **Colores**: Azul (#3b82f6) y morado (#7c3aed)
- **Layout**: Logo FVBPA arriba, sin logos extras
- **Título**: "AlignMe"
- **Estilo**: Moderno, tonos azules

### 🟣 Baleares (COTABAL)
- **Colores**: Morado (#590660), rojo (#d9121a), amarillo (#fbdc09)
- **Layout**: Logo esquina superior derecha + logo patrocinador abajo
- **Título**: "COTABAL LINE UP"
- **Estilo**: Corporativo COTABAL

## 🐛 Solución de problemas

### Error: "Cannot find module '@react-native-async-storage/async-storage'"
```powershell
npm install @react-native-async-storage/async-storage
# Luego rebuild
npm run android
```

### Error: "Unable to resolve module './config/themes'"
```powershell
# Limpiar caché
npm run start -- --reset-cache
# O reiniciar Metro completamente
```

### Las imágenes no se cargan
- Verifica que los archivos existan en `assets/asturias/` y `assets/baleares/`
- Si falta alguna imagen, la app puede crashear
- Usa placeholders temporales si es necesario

### La app no recuerda mi selección
- Verifica permisos de AsyncStorage en Android
- En desarrollo, a veces el hot reload resetea el storage
- Prueba cerrando completamente y reabriendo

### Los colores no cambian
- Asegúrate de que Metro se haya reiniciado después de los cambios
- Verifica que `createAppStyles(theme)` esté dentro del componente funcional
- Revisa la consola por errores de tema undefined

## 📱 Testing checklist

- [ ] La app inicia y muestra el selector de comunidades
- [ ] Puedo seleccionar Asturias y ver su tema azul
- [ ] Puedo seleccionar Baleares y ver su tema morado/rojo/amarillo
- [ ] El botón "Cambiar Comunidad" aparece en HomeScreen
- [ ] Al tocar "Cambiar Comunidad" vuelvo al selector
- [ ] Al cerrar y reabrir la app, recuerda mi última selección
- [ ] Los botones Entrenador y Árbitro funcionan en ambas comunidades
- [ ] En Baleares aparece el logo superior derecho y el patrocinador
- [ ] En Asturias solo aparece el logo FVBPA arriba

## 🔄 Resetear la selección manualmente

Si quieres forzar que vuelva al selector:

```powershell
# Android
adb shell run-as com.alignme rm -rf /data/data/com.alignme/shared_prefs/RCTAsyncLocalStorage*

# O desde código (añadir botón temporal)
import { useCommunity } from './context/CommunityContext';
const { clearCommunity } = useCommunity();
await clearCommunity();
```

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola de Metro para errores
2. Verifica que todos los archivos de `config/`, `context/`, `pages/`, `components/` existan
3. Asegúrate de que `package.json` incluya `@react-native-async-storage/async-storage`
4. Limpia node_modules y reinstala si es necesario

---

¡Disfruta del sistema multi-comunidad! 🎉
