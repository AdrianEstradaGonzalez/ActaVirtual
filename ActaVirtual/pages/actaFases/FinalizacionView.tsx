import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { Text } from 'react-native-paper';
import { useCommunity } from '../../context/CommunityContext';
import { Partido, Jugador } from '../../types/MockData';
import { styles } from './styles/FinalizacionStyles';
import SignatureCanvas from '../../components/SignatureCanvas';
import VectorIcon from '../../components/VectorIcon';
import { generatePDF as generatePDFLib, type PDFOptions, type PDFResult } from 'react-native-html-to-pdf';

export type MatchData = {
  setsGanadosA: number;
  setsGanadosB: number;
  marcadorSets: { puntosA: number; puntosB: number }[];
  amonestaciones: {
    equipo: 'A' | 'B';
    jugador: string;
    tipo: string;
    set: number;
  }[];
  sustituciones: {
    equipo: 'A' | 'B';
    sale: string;
    entra: string;
    set: number;
  }[];
  tiemposUsadosA: { [set: number]: number };
  tiemposUsadosB: { [set: number]: number };
  sustitucionesUsadasA: { [set: number]: number };
  sustitucionesUsadasB: { [set: number]: number };
  totalSets: number;
};

type FirmaState = {
  signed: boolean;
  signature?: string;
};

type FinalizacionViewProps = {
  partido: Partido;
  matchData: MatchData | null;
  observaciones: string;
};

export default function FinalizacionView({ partido, matchData, observaciones }: FinalizacionViewProps) {
  const { theme } = useCommunity();
  const signatureRefs = useRef<{ [key: string]: any }>({});
  const [firmaStates, setFirmaStates] = useState<{ [key: string]: FirmaState }>({});
  const [generatingPDF, setGeneratingPDF] = useState(false);

  if (!theme) return null;

  // ===== HELPERS =====
  const getCapitanName = (jugadores: Jugador[] | undefined) => {
    const capitan = jugadores?.find(j => j.esCapitan);
    return capitan ? `${capitan.nombre} ${capitan.apellidos}` : null;
  };

  const getPlayerInfo = (equipo: 'A' | 'B', dorsal: string): string => {
    const jugadores = equipo === 'A' ? partido.jugadoresDisponiblesLocal : partido.jugadoresDisponiblesVisitante;
    const jugador = jugadores?.find(j => j.dorsal === dorsal);
    if (jugador) return `#${dorsal} ${jugador.nombre} ${jugador.apellidos}`;
    return `#${dorsal}`;
  };

  const getEquipoName = (equipo: 'A' | 'B'): string => {
    return equipo === 'A' ? partido.equipoLocal : partido.equipoVisitante;
  };

  const getSanctionLabel = (tipo: string): string => {
    switch (tipo) {
      case 'amarilla': return 'Tarjeta Amarilla';
      case 'roja': return 'Tarjeta Roja';
      case 'expulsion': return 'Expulsion';
      case 'descalificacion': return 'Descalificacion';
      case 'demora-amarilla': return 'Demora (Amarilla)';
      case 'demora-roja': return 'Demora (Roja)';
      default: return tipo;
    }
  };

  const getSanctionBorder = (tipo: string) => {
    if (tipo.includes('roja') || tipo === 'expulsion' || tipo === 'descalificacion') return styles.sanctionBorderRed;
    if (tipo.includes('amarilla')) return styles.sanctionBorderYellow;
    return styles.sanctionBorderBlack;
  };

  const getSanctionIconBg = (tipo: string) => {
    if (tipo.includes('roja') || tipo === 'expulsion' || tipo === 'descalificacion') return styles.sanctionRedBg;
    if (tipo.includes('amarilla')) return styles.sanctionYellowBg;
    return styles.sanctionBlackBg;
  };

  const getSanctionIconColor = (tipo: string): string => {
    if (tipo.includes('roja') || tipo === 'expulsion' || tipo === 'descalificacion') return '#ef4444';
    if (tipo.includes('amarilla')) return '#eab308';
    return '#ffffff';
  };

  const getSanctionIconName = (tipo: string): string => {
    if (tipo.includes('amarilla')) return 'card-yellow';
    if (tipo === 'expulsion') return 'expulsion';
    if (tipo === 'descalificacion') return 'descalificacion';
    if (tipo.includes('roja')) return 'card-red';
    return 'alert-circle';
  };

  // ===== FIRMAS =====
  const firmas = useMemo(() => [
    {
      id: 'capitan-local-fin',
      role: 'Capitan',
      name: getCapitanName(partido.jugadoresDisponiblesLocal) || '',
      team: partido.equipoLocal,
    },
    {
      id: 'capitan-visitante-fin',
      role: 'Capitan',
      name: getCapitanName(partido.jugadoresDisponiblesVisitante) || '',
      team: partido.equipoVisitante,
    },
  ], [partido]);

  const handleSignature = (id: string, signature: string) => {
    setFirmaStates(prev => ({ ...prev, [id]: { signed: true, signature } }));
  };

  const handleClear = (id: string) => {
    signatureRefs.current[id]?.clearSignature();
    setFirmaStates(prev => ({ ...prev, [id]: { signed: false, signature: undefined } }));
  };

  const handleEnd = (id: string) => {
    signatureRefs.current[id]?.readSignature();
  };

  // ===== WINNER =====
  const ganadorLocal = matchData ? matchData.setsGanadosA > matchData.setsGanadosB : false;
  const partidoTerminado = matchData
    ? (matchData.setsGanadosA >= (matchData.totalSets === 5 ? 3 : 2) ||
       matchData.setsGanadosB >= (matchData.totalSets === 5 ? 3 : 2))
    : false;

  // ===== PDF GENERATION =====
  const handleGeneratePDF = async () => {
    if (!matchData) {
      Alert.alert('Sin datos', 'No hay datos del partido disponibles para generar el PDF.');
      return;
    }
    setGeneratingPDF(true);
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permiso de almacenamiento',
            message: 'Se necesita acceso al almacenamiento para guardar el PDF.',
            buttonPositive: 'Aceptar',
            buttonNegative: 'Cancelar',
            buttonNeutral: 'Mas tarde',
          }
        );
      }
      const html = buildPDFHtml();
      const options: PDFOptions = {
        html,
        fileName: `Acta_${partido.numeroPartido}_${partido.fecha.replace(/\//g, '-')}`,
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
        base64: false,
      };
      const file = await (generatePDFLib as unknown as (opts: PDFOptions) => Promise<PDFResult>)(options);
      setGeneratingPDF(false);
      Alert.alert(
        'PDF Generado',
        `El acta ha sido guardada correctamente.\n\nUbicacion: ${file.filePath}`,
        [{ text: 'Aceptar' }]
      );
    } catch (error) {
      setGeneratingPDF(false);
      Alert.alert('Error', 'No se pudo generar el PDF. Intentalo de nuevo.');
      console.error('Error generating PDF:', error);
    }
  };

  const buildPDFHtml = (): string => {
    if (!matchData) return '';
    const sanctionsHtml = matchData.amonestaciones.length > 0
      ? matchData.amonestaciones.map(a => `
        <tr>
          <td>${getSanctionLabel(a.tipo)}</td>
          <td>${getPlayerInfo(a.equipo, a.jugador)}</td>
          <td>${getEquipoName(a.equipo)}</td>
          <td>Set ${a.set}</td>
        </tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center;color:#999;">Sin sanciones</td></tr>';
    const setsHtml = matchData.marcadorSets.map((s, i) => `
      <tr>
        <td style="font-weight:bold;">Set ${i + 1}</td>
        <td style="text-align:center;${s.puntosA > s.puntosB ? 'color:#10b981;font-weight:bold;' : ''}">${s.puntosA}</td>
        <td style="text-align:center;${s.puntosB > s.puntosA ? 'color:#10b981;font-weight:bold;' : ''}">${s.puntosB}</td>
      </tr>`).join('');
    const totalSetsPlayed = matchData.marcadorSets.length;
    let timeoutsHtml = '';
    let subsHtml = '';
    for (let s = 1; s <= totalSetsPlayed; s++) {
      timeoutsHtml += `<tr><td>Set ${s}</td><td style="text-align:center;">${matchData.tiemposUsadosA[s] || 0}</td><td style="text-align:center;">${matchData.tiemposUsadosB[s] || 0}</td></tr>`;
      subsHtml += `<tr><td>Set ${s}</td><td style="text-align:center;">${matchData.sustitucionesUsadasA[s] || 0}</td><td style="text-align:center;">${matchData.sustitucionesUsadasB[s] || 0}</td></tr>`;
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 30px; font-size: 12px; }
      h1 { text-align: center; font-size: 22px; color: #0f172a; margin-bottom: 4px; }
      h2 { font-size: 15px; color: #334155; margin: 18px 0 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
      .header-info { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 11px; }
      .teams-row { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 12px 0 20px; }
      .team-name { font-size: 18px; font-weight: 900; color: #0f172a; }
      .vs { background: #f1f5f9; padding: 4px 12px; border-radius: 10px; font-weight: 700; color: #64748b; font-size: 11px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
      th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; font-size: 11px; }
      th { background-color: #0f172a; color: #fff; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
      tr:nth-child(even) { background-color: #f8fafc; }
      .result-row { background-color: #0f172a !important; }
      .result-row td { color: #fff; font-weight: 900; font-size: 13px; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; margin-bottom: 14px; }
      .info-item { display: flex; gap: 6px; }
      .info-label { font-weight: 700; color: #64748b; min-width: 100px; }
      .info-value { font-weight: 800; color: #0f172a; }
      .observations { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; line-height: 1.6; min-height: 60px; }
      .signature-area { display: inline-block; width: 45%; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px; margin: 8px 2%; min-height: 100px; vertical-align: top; }
      .signature-label { font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
      .signature-name { font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 60px; }
      .winner-badge { text-align: center; background: #10b981; color: white; padding: 6px 20px; border-radius: 12px; font-weight: 900; font-size: 13px; display: inline-block; margin: 8px auto; }
      .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 9px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style></head><body>
      <h1>Acta del Encuentro</h1>
      <div class="header-info">N Partido: ${partido.numeroPartido}</div>
      <div class="teams-row"><span class="team-name">${partido.equipoLocal}</span><span class="vs">VS</span><span class="team-name">${partido.equipoVisitante}</span></div>
      <h2>Datos del Partido</h2>
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Competicion:</span><span class="info-value">${partido.competicion}</span></div>
        <div class="info-item"><span class="info-label">Categoria:</span><span class="info-value">${partido.categoria}</span></div>
        <div class="info-item"><span class="info-label">Fecha:</span><span class="info-value">${partido.fecha}</span></div>
        <div class="info-item"><span class="info-label">Hora:</span><span class="info-value">${partido.hora}</span></div>
        <div class="info-item"><span class="info-label">Lugar:</span><span class="info-value">${partido.lugar}</span></div>
        <div class="info-item"><span class="info-label">Arbitro 1:</span><span class="info-value">${partido.arbitro1}</span></div>
        <div class="info-item"><span class="info-label">Arbitro 2:</span><span class="info-value">${partido.arbitro2}</span></div>
        ${partido.arbitro3 ? `<div class="info-item"><span class="info-label">Arbitro 3:</span><span class="info-value">${partido.arbitro3}</span></div>` : ''}
      </div>
      <h2>Marcador por Set</h2>
      <table><tr><th></th><th style="text-align:center;">${partido.equipoLocal}</th><th style="text-align:center;">${partido.equipoVisitante}</th></tr>${setsHtml}<tr class="result-row"><td>TOTAL</td><td style="text-align:center;">${matchData.setsGanadosA}</td><td style="text-align:center;">${matchData.setsGanadosB}</td></tr></table>
      ${partidoTerminado ? `<div style="text-align:center;"><span class="winner-badge">Ganador: ${ganadorLocal ? partido.equipoLocal : partido.equipoVisitante}</span></div>` : ''}
      <h2>Tiempos Muertos</h2>
      <table><tr><th></th><th style="text-align:center;">${partido.equipoLocal}</th><th style="text-align:center;">${partido.equipoVisitante}</th></tr>${timeoutsHtml}</table>
      <h2>Sustituciones</h2>
      <table><tr><th></th><th style="text-align:center;">${partido.equipoLocal}</th><th style="text-align:center;">${partido.equipoVisitante}</th></tr>${subsHtml}</table>
      <h2>Sanciones</h2>
      <table><tr><th>Tipo</th><th>Jugador</th><th>Equipo</th><th>Momento</th></tr>${sanctionsHtml}</table>
      <h2>Observaciones</h2>
      <div class="observations">${observaciones || 'Sin observaciones registradas.'}</div>
      <h2>Firmas de los Capitanes</h2>
      <div>
        <div class="signature-area"><div class="signature-label">Capitan - ${partido.equipoLocal}</div><div class="signature-name">${getCapitanName(partido.jugadoresDisponiblesLocal) || 'No registrado'}</div></div>
        <div class="signature-area"><div class="signature-label">Capitan - ${partido.equipoVisitante}</div><div class="signature-name">${getCapitanName(partido.jugadoresDisponiblesVisitante) || 'No registrado'}</div></div>
      </div>
      <div class="footer">Acta generada automaticamente por ActaVirtual &bull; ${new Date().toLocaleString('es-ES')}</div>
    </body></html>`;
  };

  // ===== RENDER =====
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* ===== 1. DATOS DEL PARTIDO ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: theme.primary + '20' }]}>
            <VectorIcon name="clipboard-text-outline" size={20} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Datos del Partido</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.teamsRow}>
          <Text style={styles.teamNameLarge} numberOfLines={2}>{partido.equipoLocal}</Text>
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <Text style={styles.teamNameLarge} numberOfLines={2}>{partido.equipoVisitante}</Text>
        </View>

        <View style={styles.matchInfoRow}>
          <VectorIcon name="trophy-outline" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Competicion</Text>
          <Text style={styles.matchInfoValue}>{partido.competicion}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="shield-star" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Categoria</Text>
          <Text style={styles.matchInfoValue}>{partido.categoria}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="calendar-blank" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Fecha</Text>
          <Text style={styles.matchInfoValue}>{partido.fecha}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="clock-outline" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Hora</Text>
          <Text style={styles.matchInfoValue}>{partido.hora}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="map-marker" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Lugar</Text>
          <Text style={styles.matchInfoValue}>{partido.lugar}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="whistle" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Arbitro 1</Text>
          <Text style={styles.matchInfoValue}>{partido.arbitro1}</Text>
        </View>
        <View style={styles.matchInfoRow}>
          <VectorIcon name="whistle" size={16} color="#64748b" />
          <Text style={styles.matchInfoLabel}>Arbitro 2</Text>
          <Text style={styles.matchInfoValue}>{partido.arbitro2}</Text>
        </View>
        {partido.arbitro3 && (
          <View style={styles.matchInfoRow}>
            <VectorIcon name="whistle" size={16} color="#64748b" />
            <Text style={styles.matchInfoLabel}>Arbitro 3</Text>
            <Text style={styles.matchInfoValue}>{partido.arbitro3}</Text>
          </View>
        )}
      </View>

      {/* ===== 2. MARCADOR POR SET ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#10b98120' }]}>
            <VectorIcon name="scoreboard-outline" size={20} color="#10b981" />
          </View>
          <Text style={styles.sectionTitle}>Marcador por Set</Text>
        </View>
        <View style={styles.divider} />

        {matchData ? (
          <>
            <View style={styles.scoreboardContainer}>
              {/* Header */}
              <View style={[styles.tableRow, styles.tableRowHeader]}>
                <View style={styles.tableCellLabel}>
                  <Text style={[styles.tableCellText, styles.tableCellTextHeader]}>Set</Text>
                </View>
                <View style={styles.tableCellValue}>
                  <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={2}>{partido.equipoLocal}</Text>
                </View>
                <View style={styles.tableCellValue}>
                  <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={2}>{partido.equipoVisitante}</Text>
                </View>
              </View>

              {/* Set rows */}
              {matchData.marcadorSets.map((set, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <View style={styles.tableCellLabel}>
                    <Text style={styles.tableCellText}>Set {index + 1}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={[
                      styles.scoreValue,
                      set.puntosA > set.puntosB && styles.scoreWinner,
                      set.puntosA < set.puntosB && styles.scoreLoser,
                    ]}>{set.puntosA}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={[
                      styles.scoreValue,
                      set.puntosB > set.puntosA && styles.scoreWinner,
                      set.puntosB < set.puntosA && styles.scoreLoser,
                    ]}>{set.puntosB}</Text>
                  </View>
                </View>
              ))}

              {/* Total row */}
              <View style={[styles.tableRow, styles.tableRowTotal]}>
                <View style={styles.tableCellLabel}>
                  <Text style={[styles.tableCellText, styles.tableCellTextTotal]}>TOTAL</Text>
                </View>
                <View style={styles.tableCellValue}>
                  <Text style={[styles.scoreValue, styles.scoreValueTotal]}>{matchData.setsGanadosA}</Text>
                </View>
                <View style={styles.tableCellValue}>
                  <Text style={[styles.scoreValue, styles.scoreValueTotal]}>{matchData.setsGanadosB}</Text>
                </View>
              </View>
            </View>

            {/* Winner badge */}
            {partidoTerminado && (
              <View style={[styles.resultBadge, { backgroundColor: '#10b981' }]}>
                <VectorIcon name="trophy-outline" size={18} color="#ffffff" />
                <Text style={styles.resultBadgeText}>
                  Ganador: {ganadorLocal ? partido.equipoLocal : partido.equipoVisitante}
                </Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noDataText}>El partido aun no ha comenzado</Text>
        )}
      </View>

      {/* ===== 3. TIEMPOS MUERTOS ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#f59e0b20' }]}>
            <VectorIcon name="timer-sand" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.sectionTitle}>Tiempos Muertos</Text>
        </View>
        <View style={styles.divider} />

        {matchData && matchData.marcadorSets.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableRowHeader]}>
              <View style={styles.tableCellLabel}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]}>Set</Text>
              </View>
              <View style={styles.tableCellValue}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={1}>{partido.equipoLocal}</Text>
              </View>
              <View style={styles.tableCellValue}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={1}>{partido.equipoVisitante}</Text>
              </View>
            </View>
            {matchData.marcadorSets.map((_s, i) => {
              const setNum = i + 1;
              return (
                <View key={`t-${setNum}`} style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <View style={styles.tableCellLabel}>
                    <Text style={styles.tableCellText}>Set {setNum}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={styles.tableCellValueText}>{matchData.tiemposUsadosA[setNum] || 0}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={styles.tableCellValueText}>{matchData.tiemposUsadosB[setNum] || 0}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>Sin datos disponibles</Text>
        )}
      </View>

      {/* ===== 4. SUSTITUCIONES ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#3b82f620' }]}>
            <VectorIcon name="swap-horizontal" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.sectionTitle}>Sustituciones</Text>
        </View>
        <View style={styles.divider} />

        {matchData && matchData.marcadorSets.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableRowHeader]}>
              <View style={styles.tableCellLabel}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]}>Set</Text>
              </View>
              <View style={styles.tableCellValue}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={1}>{partido.equipoLocal}</Text>
              </View>
              <View style={styles.tableCellValue}>
                <Text style={[styles.tableCellText, styles.tableCellTextHeader]} numberOfLines={1}>{partido.equipoVisitante}</Text>
              </View>
            </View>
            {matchData.marcadorSets.map((_s, i) => {
              const setNum = i + 1;
              return (
                <View key={`s-${setNum}`} style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <View style={styles.tableCellLabel}>
                    <Text style={styles.tableCellText}>Set {setNum}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={styles.tableCellValueText}>{matchData.sustitucionesUsadasA[setNum] || 0}</Text>
                  </View>
                  <View style={styles.tableCellValue}>
                    <Text style={styles.tableCellValueText}>{matchData.sustitucionesUsadasB[setNum] || 0}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>Sin datos disponibles</Text>
        )}
      </View>

      {/* ===== 5. REGISTRO DE SANCIONES ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#ef444420' }]}>
            <VectorIcon name="card-red" size={20} color="#ef4444" />
          </View>
          <Text style={styles.sectionTitle}>Registro de Sanciones</Text>
        </View>
        <View style={styles.divider} />

        {matchData && matchData.amonestaciones.length > 0 ? (
          matchData.amonestaciones.map((a, index) => (
            <View key={index} style={[styles.sanctionItem, getSanctionBorder(a.tipo)]}>
              <View style={[styles.sanctionIcon, getSanctionIconBg(a.tipo)]}>
                <VectorIcon
                  name={getSanctionIconName(a.tipo)}
                  size={18}
                  color={getSanctionIconColor(a.tipo)}
                />
              </View>
              <View style={styles.sanctionDetails}>
                <Text style={styles.sanctionType}>{getSanctionLabel(a.tipo)}</Text>
                <Text style={styles.sanctionPlayer}>
                  {getPlayerInfo(a.equipo, a.jugador)} — {getEquipoName(a.equipo)}
                </Text>
                <Text style={styles.sanctionSet}>Set {a.set}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No se han registrado sanciones</Text>
        )}
      </View>

      {/* ===== 6. OBSERVACIONES ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#6366f120' }]}>
            <VectorIcon name="note-outline" size={20} color="#6366f1" />
          </View>
          <Text style={styles.sectionTitle}>Observaciones</Text>
        </View>
        <View style={styles.divider} />

        <Text style={styles.observacionesText}>
          {observaciones || 'No se han registrado observaciones.'}
        </Text>
      </View>

      {/* ===== 7. FIRMAS DE CAPITANES ===== */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, { backgroundColor: '#8b5cf620' }]}>
            <VectorIcon name="account" size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.sectionTitle}>Firmas de los Capitanes</Text>
        </View>
        <View style={styles.divider} />

        {firmas.map((firma) => {
          const signed = firmaStates[firma.id]?.signed || false;
          const canSign = !!firma.name;

          return (
            <View key={firma.id} style={styles.firmaCard}>
              <View style={styles.firmaHeader}>
                <Text style={styles.firmaRole}>{firma.role} - {firma.team}</Text>
                {firma.name ? (
                  <Text style={styles.firmaName}>{firma.name}</Text>
                ) : (
                  <Text style={[styles.firmaName, { color: '#94a3b8' }]}>No hay capitan registrado</Text>
                )}
              </View>

              <View style={[styles.canvasContainer, signed && styles.canvasContainerSigned]}>
                {canSign ? (
                  <>
                    <SignatureCanvas
                      ref={(ref: any) => (signatureRefs.current[firma.id] = ref)}
                      onEnd={() => { if (!signed) handleEnd(firma.id); }}
                      onOK={(signature: string) => handleSignature(firma.id, signature)}
                      penColor="#0f172a"
                      disabled={signed}
                    />
                    {!signed && (
                      <View style={styles.emptyCanvasText} pointerEvents="none">
                        <Text style={styles.emptyText}>Toque para firmar</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.emptyText}>No disponible</Text>
                  </View>
                )}
              </View>

              {canSign && !signed ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.clearButton} onPress={() => handleClear(firma.id)}>
                    <VectorIcon name="delete" size={14} color="#64748b" />
                    <Text style={styles.clearButtonText}>Limpiar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.signButton, { backgroundColor: theme.primary }]}
                    onPress={() => handleEnd(firma.id)}
                  >
                    <VectorIcon name="check" size={14} color="#ffffff" />
                    <Text style={styles.signButtonText}>Confirmar Firma</Text>
                  </TouchableOpacity>
                </View>
              ) : signed ? (
                <View style={styles.signedBadge}>
                  <VectorIcon name="check" size={14} color="#065f46" />
                  <Text style={styles.signedBadgeText}>Firmado</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* ===== 8. GENERAR PDF ===== */}
      <View style={styles.pdfButtonContainer}>
        <TouchableOpacity
          style={[styles.pdfButton, { backgroundColor: theme.primary }, generatingPDF && styles.pdfButtonDisabled]}
          onPress={handleGeneratePDF}
          disabled={generatingPDF}
          activeOpacity={0.85}
        >
          {generatingPDF ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.pdfButtonText}>Generando PDF...</Text>
            </>
          ) : (
            <>
              <VectorIcon name="file-pdf-box" size={24} color="#ffffff" />
              <Text style={styles.pdfButtonText}>Descargar Acta en PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
