import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const plantillasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  activeTabText: {
    fontWeight: '700',
  },
  horizontalScroll: {
    flex: 1,
  },
  tabContentContainer: {
    paddingHorizontal: 16,
  },
  teamScrollView: {
    flex: 1,
  },
  teamScrollContent: {
    paddingBottom: 100,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export const sectionStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalList: {
    gap: 8,
  },
  emptySection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
  },
});

export const cardStyles = StyleSheet.create({
  personalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  personalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  personalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dorsalBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dorsalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  personalDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  personalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  dniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  personalDni: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  categoriaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
  },
  categoriaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338ca',
  },
  capitanBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capitanText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capitanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capitanButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#64748b',
  },
  capitanButtonTextActive: {
    color: '#ffffff',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
    maxHeight: 450,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomWidth: 3,
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  modalTabTextActive: {
    fontWeight: '700',
  },
  rolSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rolOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    gap: 8,
    flex: 1,
    minWidth: '48%',
  },
  rolOptionActive: {
    borderWidth: 2,
  },
  rolOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  categoriaChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  categoriaChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
});

export const jugadoresDisponiblesStyles = StyleSheet.create({
  jugadoresDisponiblesList: {
    maxHeight: 500,
  },
  jugadoresDisponiblesHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  jugadoresDisponiblesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  jugadoresDisponiblesSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyJugadores: {
    padding: 48,
    alignItems: 'center',
    gap: 12,
  },
  emptyJugadoresText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },
  emptyJugadoresSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
  },
  jugadorDisponibleCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  jugadorDisponibleContent: {
    padding: 16,
  },
  jugadorDisponibleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  jugadorDisponibleDorsalContainer: {
    width: 56,
  },
  jugadorDisponibleDorsalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  jugadorDisponibleDetails: {
    flex: 1,
  },
  jugadorDisponibleNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  jugadorDisponibleDNI: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  dniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoriaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
  },
  categoriaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338ca',
  },
  jugadorDisponibleActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  jugadorCapitanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capitanButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#64748b',
  },
  capitanButtonTextActive: {
    color: '#ffffff',
  },
  jugadorSeleccionarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  jugadorSeleccionarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export { SCREEN_WIDTH };
