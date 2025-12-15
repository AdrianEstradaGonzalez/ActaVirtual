import React, { JSX } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type VectorIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

// Icono de calendario
const CalendarIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3.01 4.9 3.01 6L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"
      fill={color}
    />
  </Svg>
);

// Icono de reloj
const ClockIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Path
      d="M12 7v5l3 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de ubicación/mapa
const MapMarkerIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill={color}
    />
  </Svg>
);

// Icono de libreta / notebook
const NotebookIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M9 7h6M9 11h6M9 15h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Icono de hashtag/número
const PoundIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 3L8 21M16 3l-2 18M4 9h17M3 15h17"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de escudo con estrella
const ShieldStarIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M12 8l1.545 3.13L17 11.765l-2.5 2.435.59 3.44L12 16.13l-3.09 1.51.59-3.44L7 11.765l3.455-.635L12 8z"
      fill={color}
    />
  </Svg>
);

// Icono de silbato
const WhistleIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="14" cy="14" r="4" stroke={color} strokeWidth={2} fill="none" />
    <Path
      d="M6 9l6 5M14 10V6l4-2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="14" cy="14" r="1.5" fill={color} />
  </Svg>
);

// Icono de persona/cuenta
const AccountIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} fill="none" />
    <Path
      d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Icono de chevron hacia abajo
const ChevronDownIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de chevron hacia arriba
const ChevronUpIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 15l-6-6-6 6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de play (reproducir)
const PlayIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5v14l11-7L8 5z"
      fill={color}
    />
  </Svg>
);

// Icono de check (aceptar)
const CheckIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de X (rechazar)
const CloseIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de menú (hamburguesa)
const MenuIcon = ({ size = 24, color = '#000' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16M4 12h16M4 18h16"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icono de logout (cerrar sesión)
const LogoutIcon = ({ size = 24, color = '#085201ff' }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function VectorIcon({ name, size = 18, color = '#0f172a', style }: VectorIconProps) {
  const iconProps = { size, color };

  const icons: { [key: string]: JSX.Element } = {
    'calendar-blank': <CalendarIcon {...iconProps} />,
    'clock-time-four-outline': <ClockIcon {...iconProps} />,
    'map-marker': <MapMarkerIcon {...iconProps} />,
    'pound': <PoundIcon {...iconProps} />,
    'shield-star': <ShieldStarIcon {...iconProps} />,
    'whistle': <WhistleIcon {...iconProps} />,
    'account': <AccountIcon {...iconProps} />,
    'chevron-down': <ChevronDownIcon {...iconProps} />,
    'chevron-up': <ChevronUpIcon {...iconProps} />,
    'play': <PlayIcon {...iconProps} />,
    'check': <CheckIcon {...iconProps} />,
    'close': <CloseIcon {...iconProps} />,
    'notebook': <NotebookIcon {...iconProps} />,
    'menu': <MenuIcon {...iconProps} />,
    'logout': <LogoutIcon {...iconProps} />,
  };

  return icons[name] || null;
}
