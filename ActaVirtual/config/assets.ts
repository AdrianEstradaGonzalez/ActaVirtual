/**
 * 🖼️ ASSET CONFIGURATION PER COMMUNITY
 * =====================================
 * Mapeo centralizado de recursos (imágenes, logos) para cada comunidad.
 */

import { CommunityId } from './themes';

export interface CommunityAssets {
  // Logos principales
  headerLogo: any;           // Logo principal del header
  appLogo: any;              // Logo de la app (258.png)
  appLogoWithLetters?: any;  // Logo con letras para App.tsx (opcional)
  topRightLogo?: any;        // Logo esquina superior derecha (opcional)
  
  // Fondos
  background: any;           // Imagen de fondo principal
  
  // Patrocinadores
  sponsorLogo?: any;         // Logo de patrocinador (opcional)
  
  // Selector de comunidad
  flag: any;                 // Bandera para el selector
  
  // Título de la app
  appTitle: string;          // Nombre de la app para esta comunidad
}

/**
 * 🔵 ASSETS ASTURIAS
 */
const AsturiasAssets: CommunityAssets = {
  headerLogo: require('../assets/asturias/logo_fvbpa.png'),
  appLogo: require('../assets/logo_sin_fondo.png'),
  appLogoWithLetters: require('../assets/asturias/logo_sinletras.png'),
  background: require('../assets/fondo.jpeg'),
  flag: require('../assets/asturias/bandera.png'),
  appTitle: 'FVBPA LINE UP',
};

/**
 * 🟣 ASSETS BALEARES (COTABAL)
 */
const BalearesAssets: CommunityAssets = {
  headerLogo: require('../assets/baleares/HEADER_BALEAR.png'),
  appLogo: require('../assets/logo_sin_fondo.png'),
  topRightLogo: require('../assets/baleares/LOGO_LETRAS.png'),
  background: require('../assets/fondo.jpeg'),
  sponsorLogo: require('../assets/baleares/LogoPatrocinio.jpg'),
  flag: require('../assets/baleares/bandera.png'),
  appTitle: 'COTABAL LINE UP',
};

/**
 * 📦 REGISTRO DE ASSETS
 */
export const COMMUNITY_ASSETS: Record<CommunityId, CommunityAssets> = {
  asturias: AsturiasAssets,
  baleares: BalearesAssets,
};

/**
 * 🎯 HELPER: Obtener assets por comunidad
 */
export const getCommunityAssets = (communityId: CommunityId): CommunityAssets => {
  return COMMUNITY_ASSETS[communityId];
};

/**
 * 📝 INSTRUCCIONES PARA AÑADIR NUEVA COMUNIDAD:
 * 
 * 1. Crea la carpeta assets/{comunidad}
 * 2. Añade los recursos necesarios (logos, bandera, fondo)
 * 3. Crea el objeto {Comunidad}Assets siguiendo la estructura
 * 4. Añade al objeto COMMUNITY_ASSETS
 * 5. Define el appTitle personalizado
 */
