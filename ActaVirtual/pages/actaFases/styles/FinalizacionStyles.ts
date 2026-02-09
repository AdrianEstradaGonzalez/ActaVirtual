import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // ===== SECTION CARD =====
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.3,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },

  // ===== DATOS DEL PARTIDO =====
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  matchInfoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    width: 110,
  },
  matchInfoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  teamNameLarge: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  vsBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1,
  },

  // ===== UNIFIED TABLE STYLES (scoreboard, timeouts, subs) =====
  scoreboardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowHeader: {
    backgroundColor: '#0f172a',
    minHeight: 46,
    borderBottomWidth: 0,
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableRowOdd: {
    backgroundColor: '#f8fafc',
  },
  tableRowTotal: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 0,
    minHeight: 46,
  },
  tableCellLabel: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  tableCellValue: {
    flex: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  tableCellTextHeader: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tableCellTextTotal: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  tableCellValueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },
  scoreValueTotal: {
    color: '#ffffff',
    fontSize: 18,
  },
  scoreWinner: {
    color: '#10b981',
  },
  scoreLoser: {
    color: '#ef4444',
  },
  resultBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 14,
  },
  resultBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // ===== SANCIONES =====
  sanctionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    gap: 10,
  },
  sanctionBorderYellow: {
    borderLeftColor: '#eab308',
  },
  sanctionBorderRed: {
    borderLeftColor: '#ef4444',
  },
  sanctionBorderBlack: {
    borderLeftColor: '#0f172a',
  },
  sanctionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanctionYellowBg: {
    backgroundColor: '#fef9c3',
  },
  sanctionRedBg: {
    backgroundColor: '#fee2e2',
  },
  sanctionBlackBg: {
    backgroundColor: '#1e293b',
  },
  sanctionDetails: {
    flex: 1,
  },
  sanctionType: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  sanctionPlayer: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  sanctionSet: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },

  // ===== OBSERVACIONES =====
  observacionesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 22,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  // ===== FIRMAS =====
  firmaCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  firmaHeader: {
    marginBottom: 12,
  },
  firmaRole: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  firmaName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  canvasContainer: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',
  },
  canvasContainerSigned: {
    borderColor: '#10b981',
    borderStyle: 'solid',
  },
  emptyCanvasText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  signButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#d1fae5',
    marginTop: 10,
  },
  signedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065f46',
  },

  // ===== PDF BUTTON =====
  pdfButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pdfButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  pdfButtonDisabled: {
    opacity: 0.5,
  },
});
