// types/navigation.ts
import { Partido } from './MockData';

export type RootStackParamList = {
  Home: undefined;       
  Entrenador: undefined;
  Arbitro: undefined;
  QRView: { data: string };
  Designaciones: undefined;
  ActaVirtual: { partido: Partido };
};
