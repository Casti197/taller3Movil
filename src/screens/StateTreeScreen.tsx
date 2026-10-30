import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectStats,
  selectInventory,
  selectActionLog,
  selectHeroComputedStatus,
} from '../store/selectors';
import { resetHeroForgeStore } from '../store';

export const StateTreeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectStats);
  const inventory = useAppSelector(selectInventory);
  const actionLog = useAppSelector(selectActionLog);
  const status = useAppSelector(selectHeroComputedStatus);

  const [statsCollapsed, setStatsCollapsed] = useState(false);
  const [invCollapsed, setInvCollapsed] = useState(false);
  const [logCollapsed, setLogCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time Travel simulation state
  const actionSequence = [
    '@@redux/INIT',
    'stats/allocate_STR',
    'stats/allocate_AGI',
    'inventory/obtain_SWORD',
    'inventory/toggleEquipItem',
    'stats/syncVitals_HP',
    'combat/dealBossDamage',
    'inventory/toggleEquip_ARMOR',
    'act_104: CURRENT_HEAD',
  ];
  const [timeStep, setTimeStep] = useState(actionSequence.length - 1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleAll = () => {
    const next = !statsCollapsed;
    setStatsCollapsed(next);
    setInvCollapsed(next);
    setLogCollapsed(next);
  };

  const handleReplay = () => {
    setTimeStep(0);
    showToast('Replay Stream iniciado...');
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= actionSequence.length) {
        clearInterval(interval);
        showToast('Replay Stream completado');
      } else {
        setTimeStep(current);
      }
    }, 400);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={16} color={theme.colors.tertiary} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <MaterialIcons name="account-tree" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>RootState Tree</Text>
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Redux Store Memory Heap Inspector</Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => showToast('¡RootState JSON copiado al portapapeles!')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="content-copy" size={14} color={theme.colors.primary} />
            <Text style={styles.actionBtnText}>JSON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => showToast('Snapshot .json exportado con éxito')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="file-download" size={14} color={theme.colors.onPrimary} />
            <Text style={styles.actionBtnTextPrimary}>Snapshot</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DevTools Protocol Conduit Bar */}
      <View style={styles.conduitBar}>
        <View style={styles.conduitLeft}>
          <View style={styles.pingDot} />
          <Text style={styles.conduitText}>DevTools Protocol v2.8.4</Text>
        </View>
        <View style={styles.conduitRight}>
          <Text style={styles.conduitStat}>3 Slices</Text>
          <Text style={styles.conduitDivider}>•</Text>
          <Text style={[styles.conduitStat, { color: theme.colors.tertiary }]}>14.2 KB</Text>
        </View>
      </View>

      {/* Immutable Store Nodes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="code" size={16} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>IMMUTABLE STORE NODES</Text>
          </View>
          <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
            <Text style={styles.toggleAllText}>
              {statsCollapsed && invCollapsed && logCollapsed ? 'Expand All' : 'Collapse All'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tree Terminal Box */}
        <View style={styles.terminalBox}>
          <Text style={styles.treeRoot}>
            type <Text style={{ color: theme.colors.tertiary }}>RootState</Text> = {'{'}
          </Text>

          {/* SLICE 1: statsSlice */}
          <View style={styles.sliceNode}>
            <TouchableOpacity
              style={styles.sliceHeaderBtn}
              onPress={() => setStatsCollapsed(!statsCollapsed)}
              activeOpacity={0.7}
            >
              <View style={styles.sliceHeaderLeft}>
                <MaterialIcons
                  name={statsCollapsed ? 'chevron-right' : 'expand-more'}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.sliceKeyPrimary}>stats</Text>
                <Text style={styles.sliceColon}>:</Text>
                <View style={styles.sliceTypeBadge}>
                  <Text style={styles.sliceTypeBadgeText}>statsSlice</Text>
                </View>
              </View>
              <Text style={styles.slicePropCount}>{'{ 6 properties }'}</Text>
            </TouchableOpacity>

            {!statsCollapsed && (
              <View style={styles.nodeBody}>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>availablePoints:</Text>
                  <Text style={styles.propValueNum}>{stats.availablePoints}</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>str:</Text>
                  <Text style={styles.propValueNum}>{stats.str}</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>agi:</Text>
                  <Text style={styles.propValueNum}>{stats.agi}</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>int:</Text>
                  <Text style={styles.propValueNum}>{stats.int}</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>currentHp:</Text>
                  <Text style={styles.propValueNum}>{stats.currentHp}</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>maxHp:</Text>
                  <Text style={styles.propValueNum}>{stats.maxHp}</Text>
                </View>
              </View>
            )}
          </View>

          {/* SLICE 2: inventorySlice */}
          <View style={styles.sliceNode}>
            <TouchableOpacity
              style={styles.sliceHeaderBtn}
              onPress={() => setInvCollapsed(!invCollapsed)}
              activeOpacity={0.7}
            >
              <View style={styles.sliceHeaderLeft}>
                <MaterialIcons
                  name={invCollapsed ? 'chevron-right' : 'expand-more'}
                  size={16}
                  color={theme.colors.tertiary}
                />
                <Text style={styles.sliceKeyTertiary}>inventory</Text>
                <Text style={styles.sliceColon}>:</Text>
                <View style={[styles.sliceTypeBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Text style={[styles.sliceTypeBadgeText, { color: theme.colors.tertiary }]}>
                    inventorySlice
                  </Text>
                </View>
              </View>
              <Text style={styles.slicePropCount}>{'{ catalog, equipped }'}</Text>
            </TouchableOpacity>

            {!invCollapsed && (
              <View style={styles.nodeBody}>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>catalog:</Text>
                  <Text style={styles.propValueArray}>[ ItemEntity × {inventory.catalog.length} ]</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>equippedIds:</Text>
                  <Text style={styles.propValueArray}>
                    [{inventory.equippedIds.map((id) => `'${id}'`).join(', ') || ' Ninguno '}]
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* SLICE 3: actionLogSlice */}
          <View style={styles.sliceNode}>
            <TouchableOpacity
              style={styles.sliceHeaderBtn}
              onPress={() => setLogCollapsed(!logCollapsed)}
              activeOpacity={0.7}
            >
              <View style={styles.sliceHeaderLeft}>
                <MaterialIcons
                  name={logCollapsed ? 'chevron-right' : 'expand-more'}
                  size={16}
                  color={theme.colors.secondary}
                />
                <Text style={styles.sliceKeySecondary}>actionLog</Text>
                <Text style={styles.sliceColon}>:</Text>
                <View style={[styles.sliceTypeBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Text style={[styles.sliceTypeBadgeText, { color: theme.colors.secondary }]}>
                    actionLogSlice
                  </Text>
                </View>
              </View>
              <Text style={styles.slicePropCount}>{`{ buffer: ${actionLog.history.length} }`}</Text>
            </TouchableOpacity>

            {!logCollapsed && (
              <View style={styles.nodeBody}>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>history:</Text>
                  <Text style={styles.propValueArray}>[ ActionRecord × {actionLog.history.length} ]</Text>
                </View>
                <View style={styles.nodePropRow}>
                  <Text style={styles.propName}>lastActionId:</Text>
                  <Text style={styles.propValueString}>"{actionLog.lastActionId}"</Text>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.treeClose}>{'}'}</Text>
        </View>
      </View>

      {/* Computed Selectors (Reselect) Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="psychology" size={18} color={theme.colors.tertiary} />
            <Text style={styles.sectionTitle}>COMPUTED SELECTORS (ESTADO DERIVADO)</Text>
          </View>
          <View style={styles.memoizedBadge}>
            <MaterialIcons name="cached" size={12} color={theme.colors.tertiary} />
            <Text style={styles.memoizedText}>MEMOIZED</Text>
          </View>
        </View>

        {/* Educational Card */}
        <View style={styles.eduCard}>
          <Text style={styles.eduTitle}>createSelector() Architecture • Zero Redundancy</Text>
          <Text style={styles.eduDesc}>
            Los valores derivados <Text style={{ fontWeight: '700', color: theme.colors.onSurface }}>NO se almacenan</Text> en el store de Redux para prevenir inconsistencias de estado. Se computan en memoria al vuelo.
          </Text>

          {/* Code preview snippet */}
          <View style={styles.codeBox}>
            <Text style={styles.codeComment}>// Arcane Selector Pipeline</Text>
            <Text style={styles.codeLine}>
              <Text style={{ color: theme.colors.primary }}>export const </Text>
              <Text style={{ color: theme.colors.tertiary }}>selectHeroComputedStatus </Text>= createSelector(
            </Text>
            <Text style={[styles.codeLine, { paddingLeft: 12 }]}>
              [selectStats, selectEquippedItems],
            </Text>
            <Text style={[styles.codeLine, { paddingLeft: 12 }]}>
              (stats, equipped) =&gt; ({'{ combatPower, totalWeight, isOverloaded }'})
            </Text>
            <Text style={styles.codeLine}>);</Text>
          </View>

          {/* 4 Computed Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricCardTop}>
                <Text style={styles.metricCardLabel}>Combat Power</Text>
                <MaterialIcons name="sports-martial-arts" size={14} color={theme.colors.primary} />
              </View>
              <Text style={[styles.metricCardVal, { color: theme.colors.primary }]}>
                {status.combatPower} PTS
              </Text>
              <Text style={styles.metricCardFormula}>f(str×3 + agi×2 + int×3)</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricCardTop}>
                <Text style={styles.metricCardLabel}>Total Weight</Text>
                <MaterialIcons name="fitness-center" size={14} color={theme.colors.tertiary} />
              </View>
              <Text style={styles.metricCardVal}>{status.totalWeight} KG</Text>
              <Text style={styles.metricCardFormula}>Cap: {status.maxWeightCapacity} KG</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricCardTop}>
                <Text style={styles.metricCardLabel}>Overencumbered</Text>
                <MaterialIcons name="directions-walk" size={14} color={theme.colors.tertiary} />
              </View>
              <View
                style={[
                  styles.statusTag,
                  status.isOverloaded
                    ? { backgroundColor: 'rgba(239, 68, 68, 0.2)' }
                    : { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    status.isOverloaded ? { color: theme.colors.secondary } : { color: theme.colors.tertiary },
                  ]}
                >
                  {status.isOverloaded ? 'TRUE' : 'FALSE'}
                </Text>
              </View>
              <Text style={styles.metricCardFormula}>weight &gt; maxWeight</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricCardTop}>
                <Text style={styles.metricCardLabel}>Dominant Class</Text>
                <MaterialIcons name="military-tech" size={14} color={status.auraColor} />
              </View>
              <Text style={[styles.metricCardVal, { color: status.auraColor }]}>
                {status.heroClass.split(' ')[0]}
              </Text>
              <Text style={styles.metricCardFormula}>Based on Highest Stat</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Time Travel Debugger Tool */}
      <View style={styles.section}>
        <View style={styles.timeTravelCard}>
          <View style={styles.timeTravelTop}>
            <View style={styles.timeTravelLeft}>
              <View style={styles.headerIconBox}>
                <MaterialIcons name="history" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.timeTravelTitle}>Time Travel Debugger</Text>
                <Text style={styles.timeTravelSub}>Deterministic Snapshot Replay</Text>
              </View>
            </View>

            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>
                STEP {timeStep + 1}/{actionSequence.length}
              </Text>
            </View>
          </View>

          {/* Action indicator */}
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabelStart}>Initial State (@@INIT)</Text>
            <Text style={styles.sliderLabelCurrent}>{actionSequence[timeStep]}</Text>
          </View>

          {/* Slider Step Buttons Row */}
          <View style={styles.stepButtonsContainer}>
            {actionSequence.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.stepDot, timeStep === idx && styles.stepDotActive]}
                onPress={() => setTimeStep(idx)}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepDotText, timeStep === idx && styles.stepDotTextActive]}>
                  #{idx}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Control Buttons Grid */}
          <View style={styles.timeTravelControls}>
            <TouchableOpacity
              style={styles.ttBtn}
              onPress={() => setTimeStep(Math.max(0, timeStep - 1))}
              activeOpacity={0.7}
            >
              <MaterialIcons name="fast-rewind" size={16} color={theme.colors.primary} />
              <Text style={styles.ttBtnText}>Prev Step</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ttBtnPrimary} onPress={handleReplay} activeOpacity={0.7}>
              <MaterialIcons name="replay" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.ttBtnPrimaryText}>Replay Stream</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ttBtnSecondary}
              onPress={() => {
                dispatch(resetHeroForgeStore());
                setTimeStep(0);
                showToast('Estado reestablecido al inicio');
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="restart-alt" size={16} color={theme.colors.secondary} />
              <Text style={styles.ttBtnSecondaryText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: theme.spacing.base,
    gap: theme.spacing.base,
    paddingBottom: 40,
  },
  toast: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  liveBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  actionBtnTextPrimary: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  conduitBar: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conduitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  conduitText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  conduitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conduitStat: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  conduitDivider: {
    color: theme.colors.outline,
    fontSize: 8,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  toggleAllText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  terminalBox: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  treeRoot: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  sliceNode: {
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    gap: 4,
  },
  sliceHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  sliceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sliceKeyPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  sliceKeyTertiary: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.tertiary,
    fontFamily: 'monospace',
  },
  sliceKeySecondary: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.secondary,
    fontFamily: 'monospace',
  },
  sliceColon: {
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  sliceTypeBadge: {
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  sliceTypeBadgeText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  slicePropCount: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.outline,
  },
  nodeBody: {
    paddingLeft: 20,
    gap: 3,
  },
  nodePropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  propName: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  propValueNum: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.tertiary,
  },
  propValueArray: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  propValueString: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.amber,
  },
  treeClose: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  memoizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  memoizedText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.tertiary,
  },
  eduCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  eduTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  eduDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  codeBox: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 2,
  },
  codeComment: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.outline,
  },
  codeLine: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.onSurface,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    gap: 2,
  },
  metricCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricCardLabel: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  metricCardVal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: 'monospace',
  },
  metricCardFormula: {
    fontSize: 9,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timeTravelCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 10,
  },
  timeTravelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTravelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeTravelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  timeTravelSub: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
  },
  stepBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.onPrimary,
    fontFamily: 'monospace',
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabelStart: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
  },
  sliderLabelCurrent: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.primary,
  },
  stepButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 3,
  },
  stepDot: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
  },
  stepDotText: {
    fontSize: 8,
    fontFamily: 'monospace',
    color: theme.colors.outline,
    fontWeight: '700',
  },
  stepDotTextActive: {
    color: theme.colors.onPrimary,
  },
  timeTravelControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  ttBtn: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ttBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  ttBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ttBtnPrimaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  ttBtnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ttBtnSecondaryText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
});
