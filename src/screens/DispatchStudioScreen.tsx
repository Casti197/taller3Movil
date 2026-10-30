import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { selectActionLog, selectStats, selectInventory } from '../store/selectors';
import {
  takeDamage,
  healHero,
  incrementStat,
  decrementStat,
  applyBuildPreset,
} from '../store/slices/statsSlice';
import { toggleEquipItem, clearEquipment } from '../store/slices/inventorySlice';
import { clearActionLog, recordAction } from '../store/slices/actionLogSlice';

export const DispatchStudioScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const actionLog = useAppSelector(selectActionLog);
  const stats = useAppSelector(selectStats);
  const inventory = useAppSelector(selectInventory);

  const [selectedAction, setSelectedAction] = useState<string>('takeDamage');
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify({ amount: 28, type: 'ARCANE_CRIT', ignoreArmor: false }, null, 2)
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const actionPresets: Record<string, object> = {
    takeDamage: { amount: 25, type: 'ARCANE_CRIT' },
    healHero: { amount: 50 },
    incrementStat: { stat: 'str' },
    decrementStat: { stat: 'agi' },
    applyBuildPreset: { preset: 'MAGE' },
    toggleEquipItem: { itemId: 'item_armor' },
    clearEquipment: {},
  };

  const handleActionSelect = (act: string) => {
    setSelectedAction(act);
    if (actionPresets[act]) {
      setPayloadText(JSON.stringify(actionPresets[act], null, 2));
    }
  };

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(payloadText);
      setPayloadText(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setFeedbackMsg('JSON inválido');
      setTimeout(() => setFeedbackMsg(null), 2000);
    }
  };

  const handleMasterDispatch = () => {
    try {
      const parsed = JSON.parse(payloadText);

      switch (selectedAction) {
        case 'takeDamage':
          dispatch(takeDamage(parsed.amount || 25));
          break;
        case 'healHero':
          dispatch(healHero(parsed.amount || 50));
          break;
        case 'incrementStat':
          dispatch(incrementStat(parsed.stat || 'str'));
          break;
        case 'decrementStat':
          dispatch(decrementStat(parsed.stat || 'str'));
          break;
        case 'applyBuildPreset':
          dispatch(applyBuildPreset(parsed.preset || 'MAGE'));
          break;
        case 'toggleEquipItem':
          dispatch(toggleEquipItem(parsed.itemId || 'item_sword'));
          break;
        case 'clearEquipment':
          dispatch(clearEquipment());
          break;
        default:
          dispatch(
            recordAction({
              type: `custom/${selectedAction}`,
              payloadStr: JSON.stringify(parsed),
              diff: 'CUSTOM_DISPATCH',
              category: 'system',
            })
          );
      }

      setFeedbackMsg(`✓ Dispatch ejecutado: ${selectedAction}`);
      setTimeout(() => setFeedbackMsg(null), 2000);
    } catch (err) {
      setFeedbackMsg('Error: verifica la sintaxis del JSON');
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  const triggerQuickScenario = (actionName: string, payload: any) => {
    setSelectedAction(actionName);
    setPayloadText(JSON.stringify(payload, null, 2));

    if (actionName === 'takeDamage') {
      dispatch(takeDamage(payload.amount));
    } else if (actionName === 'applyBuildPreset') {
      dispatch(applyBuildPreset(payload.preset));
    } else if (actionName === 'toggleEquipItem') {
      dispatch(toggleEquipItem(payload.itemId));
    } else if (actionName === 'healHero') {
      dispatch(healHero(payload.amount));
    }

    setFeedbackMsg(`✓ Escenario disparado: ${actionName}`);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Toast Feedback */}
      {feedbackMsg && (
        <View style={styles.feedbackToast}>
          <MaterialIcons name="bolt" size={16} color={theme.colors.primary} />
          <Text style={styles.feedbackToastText}>{feedbackMsg}</Text>
        </View>
      )}

      {/* Telemetry Status Banner */}
      <View style={styles.telemetryBanner}>
        <View style={styles.telemetryLeft}>
          <View style={styles.telemetryIconBox}>
            <MaterialIcons name="terminal" size={18} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.telemetryLabel}>DISPATCHER HOOK</Text>
            <Text style={styles.telemetryHook}>useAppDispatch()</Text>
          </View>
        </View>

        <View style={styles.telemetryRight}>
          <View style={styles.pulseDot} />
          <Text style={styles.telemetryRightText}>STORE SYNC: 120 FPS</Text>
        </View>
      </View>

      {/* Hero Header Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroCardHeader}>
          <View style={styles.heroCardTitleRow}>
            <MaterialIcons name="bolt" size={20} color={theme.colors.primary} />
            <Text style={styles.heroCardTitle}>RTK DISPATCH STUDIO</Text>
          </View>
          <View style={styles.immerBadge}>
            <Text style={styles.immerBadgeText}>Immer Proxy: Active</Text>
          </View>
        </View>
        <Text style={styles.heroCardDesc}>
          Inyecta mutaciones controladas al grafo de estado de HeroForge. Valida inmutabilidad, middleware diffs y evaluadores de combate en tiempo real.
        </Text>
      </View>

      {/* Action Creator Playground */}
      <View style={styles.playgroundCard}>
        <View style={styles.playgroundHeader}>
          <View style={styles.playgroundTitleRow}>
            <MaterialIcons name="tune" size={18} color={theme.colors.primary} />
            <Text style={styles.playgroundTitle}>ACTION CREATOR PLAYGROUND</Text>
          </View>
          <Text style={styles.payloadTag}>type/payload</Text>
        </View>

        {/* Action Type Selector Chips */}
        <Text style={styles.inputLabel}>ACTION CREATOR (TYPE)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[
            { key: 'takeDamage', label: 'stats/takeDamage' },
            { key: 'healHero', label: 'stats/healHero' },
            { key: 'incrementStat', label: 'stats/incrementStat' },
            { key: 'decrementStat', label: 'stats/decrementStat' },
            { key: 'applyBuildPreset', label: 'stats/applyBuildPreset' },
            { key: 'toggleEquipItem', label: 'inventory/toggleEquipItem' },
            { key: 'clearEquipment', label: 'inventory/clearEquipment' },
          ].map((act) => {
            const isSelected = selectedAction === act.key;
            return (
              <TouchableOpacity
                key={act.key}
                style={[styles.actionChip, isSelected && styles.actionChipActive]}
                onPress={() => handleActionSelect(act.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionChipText, isSelected && styles.actionChipTextActive]}>
                  {act.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Payload JSON Editor */}
        <View style={styles.jsonHeaderRow}>
          <Text style={styles.inputLabel}>INTERACTIVE PAYLOAD (JSON OBJECT)</Text>
          <TouchableOpacity onPress={handlePrettify} activeOpacity={0.7} style={styles.prettifyBtn}>
            <Text style={styles.prettifyBtnText}>Prettify</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.jsonInput}
          multiline
          value={payloadText}
          onChangeText={setPayloadText}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        {/* Master Dispatch Button */}
        <TouchableOpacity style={styles.masterDispatchBtn} onPress={handleMasterDispatch} activeOpacity={0.8}>
          <MaterialIcons name="electric-bolt" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.masterDispatchText}>DISPATCH TO REDUX STORE</Text>
          <View style={styles.rtkVersionBadge}>
            <Text style={styles.rtkVersionText}>RTK v2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* One-Click Test Scenarios */}
      <View style={styles.scenariosCard}>
        <View style={styles.scenariosHeader}>
          <Text style={styles.scenariosTitle}>ONE-CLICK TEST SCENARIOS</Text>
          <Text style={styles.scenariosCount}>4 Scenarios Loaded</Text>
        </View>

        <View style={styles.scenariosGrid}>
          {/* Scenario 1 */}
          <TouchableOpacity
            style={styles.scenarioBtn}
            onPress={() => triggerQuickScenario('takeDamage', { amount: 50, critical: true })}
            activeOpacity={0.7}
          >
            <View style={styles.scenarioTop}>
              <MaterialIcons name="dangerous" size={16} color={theme.colors.secondary} />
              <Text style={[styles.scenarioLabel, { color: theme.colors.secondary }]}>
                CRIT DMG (-50 HP)
              </Text>
            </View>
            <Text style={styles.scenarioSub}>stats/takeDamage</Text>
          </TouchableOpacity>

          {/* Scenario 2 */}
          <TouchableOpacity
            style={styles.scenarioBtn}
            onPress={() => triggerQuickScenario('applyBuildPreset', { preset: 'MAGE' })}
            activeOpacity={0.7}
          >
            <View style={styles.scenarioTop}>
              <MaterialIcons name="auto-fix-high" size={16} color={theme.colors.primary} />
              <Text style={[styles.scenarioLabel, { color: theme.colors.primary }]}>
                ARCHMAGE BUILD
              </Text>
            </View>
            <Text style={styles.scenarioSub}>stats/applyBuildPreset</Text>
          </TouchableOpacity>

          {/* Scenario 3 */}
          <TouchableOpacity
            style={styles.scenarioBtn}
            onPress={() => triggerQuickScenario('toggleEquipItem', { itemId: 'item_armor' })}
            activeOpacity={0.7}
          >
            <View style={styles.scenarioTop}>
              <MaterialIcons name="fitness-center" size={16} color={theme.colors.amber} />
              <Text style={[styles.scenarioLabel, { color: theme.colors.amber }]}>
                CARRY OVERLOAD
              </Text>
            </View>
            <Text style={styles.scenarioSub}>inventory/toggleEquip</Text>
          </TouchableOpacity>

          {/* Scenario 4 */}
          <TouchableOpacity
            style={styles.scenarioBtn}
            onPress={() => triggerQuickScenario('healHero', { amount: 100 })}
            activeOpacity={0.7}
          >
            <View style={styles.scenarioTop}>
              <MaterialIcons name="favorite" size={16} color={theme.colors.tertiary} />
              <Text style={[styles.scenarioLabel, { color: theme.colors.tertiary }]}>
                FULL SANCTUARY
              </Text>
            </View>
            <Text style={styles.scenarioSub}>stats/healHero</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Middleware Execution Trace */}
      <View style={styles.middlewareCard}>
        <View style={styles.middlewareHeader}>
          <View style={styles.middlewareTitleRow}>
            <MaterialIcons name="history" size={18} color={theme.colors.tertiary} />
            <Text style={styles.middlewareTitle}>MIDDLEWARE EXECUTION TRACE</Text>
          </View>
          <View style={styles.middlewareControls}>
            <TouchableOpacity onPress={() => dispatch(clearActionLog())} activeOpacity={0.7}>
              <Text style={styles.clearLogsText}>Clear</Text>
            </TouchableOpacity>
            <View style={styles.dispatchedPill}>
              <Text style={styles.dispatchedPillText}>{actionLog.history.length} DISPATCHED</Text>
            </View>
          </View>
        </View>

        <View style={styles.logsStack}>
          {actionLog.history.slice(0, 4).map((log, index) => {
            let color = theme.colors.primary;
            if (log.category === 'stats') color = theme.colors.primary;
            else if (log.category === 'combat') color = theme.colors.secondary;
            else if (log.category === 'inventory') color = theme.colors.tertiary;

            return (
              <View key={log.id} style={styles.traceRow}>
                <View style={styles.traceTop}>
                  <View style={styles.traceActionType}>
                    <View style={[styles.traceDot, { backgroundColor: color }]} />
                    <Text style={[styles.traceActionText, { color }]}>{log.type}</Text>
                    <View style={styles.traceStatusPill}>
                      <Text style={[styles.traceStatusText, { color }]}>{log.diff}</Text>
                    </View>
                  </View>
                  <Text style={styles.traceTimestamp}>{log.timestamp}</Text>
                </View>

                <View style={styles.traceDiffBox}>
                  <View style={styles.diffCol}>
                    <Text style={styles.diffHeader}>ACTION PAYLOAD</Text>
                    <Text style={styles.diffContent} numberOfLines={1}>
                      {log.payloadStr}
                    </Text>
                  </View>
                  <View style={styles.diffCol}>
                    <Text style={styles.diffHeader}>NEXT IMMER TREE</Text>
                    <Text style={[styles.diffContent, { color }]} numberOfLines={1}>
                      {`{ HP: ${stats.currentHp}, STR: ${stats.str}, EQ: ${inventory.equippedIds.length} }`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Educational Concept Callout */}
      <View style={styles.conceptCard}>
        <View style={styles.conceptTitleRow}>
          <MaterialIcons name="school" size={18} color={theme.colors.primary} />
          <Text style={styles.conceptTitle}>CONCEPTO CLAVE REDUX TOOLKIT</Text>
        </View>
        <Text style={styles.conceptDesc}>
          A diferencia del Redux tradicional, <Text style={{ fontFamily: 'monospace', color: theme.colors.tertiary }}>createSlice</Text> utiliza la librería <Text style={{ fontWeight: '700', color: theme.colors.onSurface }}>Immer</Text> internamente. Esto permite escribir código de mutación "directo" (ej. <Text style={{ fontFamily: 'monospace', color: theme.colors.primary }}>state.currentHp -= action.payload</Text>) que es transformado automáticamente en copias inmutables y puras.
        </Text>
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
  feedbackToast: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  feedbackToastText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  telemetryBanner: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telemetryIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  telemetryHook: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  telemetryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  telemetryRightText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.tertiary,
    fontFamily: 'monospace',
  },
  heroCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 6,
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  immerBadge: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  immerBadgeText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  heroCardDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  playgroundCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 10,
  },
  playgroundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playgroundTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playgroundTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  payloadTag: {
    fontSize: 9,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  chipRow: {
    gap: 6,
    paddingVertical: 2,
  },
  actionChip: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: theme.colors.primary,
  },
  actionChipText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  actionChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  jsonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prettifyBtn: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  prettifyBtnText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.primary,
  },
  jsonInput: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    fontFamily: 'monospace',
    fontSize: 11,
    color: theme.colors.tertiary,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  masterDispatchBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  masterDispatchText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.onPrimary,
    letterSpacing: 0.5,
  },
  rtkVersionBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  rtkVersionText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  scenariosCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  scenariosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenariosTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  scenariosCount: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.secondary,
  },
  scenariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scenarioBtn: {
    width: '48%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 3,
  },
  scenarioTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scenarioLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  scenarioSub: {
    fontSize: 9,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  middlewareCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 10,
  },
  middlewareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middlewareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  middlewareTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  middlewareControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearLogsText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  dispatchedPill: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  dispatchedPillText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.primary,
  },
  logsStack: {
    gap: 8,
  },
  traceRow: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    gap: 6,
  },
  traceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  traceActionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  traceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  traceActionText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  traceStatusPill: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  traceStatusText: {
    fontSize: 8,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  traceTimestamp: {
    fontSize: 9,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  traceDiffBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.sm,
    padding: 6,
    gap: 8,
  },
  diffCol: {
    flex: 1,
    gap: 2,
  },
  diffHeader: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.outline,
  },
  diffContent: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.onSurface,
  },
  conceptCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  conceptTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conceptTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  conceptDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
});
