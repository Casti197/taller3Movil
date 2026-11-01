import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectCombat,
  selectRecentActions,
  selectCombatPower,
  selectAttackDamage,
  selectCanAttack,
  selectHpStatus,
  selectMana,
  ATTACK_MP_COST,
  BOSS_COUNTER_DAMAGE,
} from '../../store/selectors';
import { dealBossDamage, resetBoss } from '../../store/slices/combatSlice';
import { takeDamage, healHero, spendMana } from '../../store/slices/statsSlice';

export const ReduxLiveInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const combat = useAppSelector(selectCombat);
  const recentActions = useAppSelector(selectRecentActions);
  const combatPower = useAppSelector(selectCombatPower);
  const attackDamage = useAppSelector(selectAttackDamage);
  const canAttack = useAppSelector(selectCanAttack);
  const hpStatus = useAppSelector(selectHpStatus);
  const mana = useAppSelector(selectMana);

  const handleAttackBoss = () => {
    dispatch(spendMana(ATTACK_MP_COST));
    dispatch(dealBossDamage({ damage: attackDamage, combatPower }));
    // El Boss contraataca para evidenciar la reactividad del HP del héroe
    dispatch(takeDamage(BOSS_COUNTER_DAMAGE));
  };

  const handleHeal = () => {
    dispatch(healHero(undefined));
  };

  const handleResetBoss = () => {
    dispatch(resetBoss());
  };

  let attackHint = `-${attackDamage} DMG · ${ATTACK_MP_COST} MP`;
  if (hpStatus === 'DERROTADO') attackHint = 'Héroe derrotado: cúrate';
  else if (combat.bossHp <= 0) attackHint = 'Boss vencido';
  else if (mana.currentMp < ATTACK_MP_COST) attackHint = 'Sin maná: cúrate';

  const bossHpPercent = Math.max(0, Math.min(100, (combat.bossHp / combat.bossMaxHp) * 100));

  return (
    <View style={styles.card}>
      {/* Zone Header Tag */}
      <View style={styles.headerRow}>
        <View style={styles.sliceTag}>
          <Text style={styles.sliceTagText}>actionLogSlice.ts</Text>
          <Text style={styles.zoneText}>ZONA D</Text>
        </View>

        <View style={styles.devtoolsBridge}>
          <View style={styles.bridgeDot} />
          <Text style={styles.bridgeText}>Redux DevTools Bridge</Text>
        </View>
      </View>

      {/* Boss Encounter Widget */}
      <View style={styles.bossCard}>
        <View style={styles.bossTopRow}>
          <View style={styles.bossIdentity}>
            <View style={styles.bossAvatarBox}>
              <Text style={styles.bossAvatar}>{combat.bossHp > 0 ? '👹' : '☠️'}</Text>
            </View>

            <View style={styles.bossTexts}>
              <View style={styles.bossTitleRow}>
                <Text style={styles.bossName}>Malakor el Inmutable</Text>
                <View style={styles.bossTag}>
                  <Text style={styles.bossTagText}>RAID BOSS</Text>
                </View>
              </View>
              <Text style={styles.bossHpText}>
                HP: {combat.bossHp.toLocaleString()} / {combat.bossMaxHp.toLocaleString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.attackBtn, !canAttack && styles.btnDisabled]}
            onPress={handleAttackBoss}
            disabled={!canAttack}
            activeOpacity={0.7}
          >
            <MaterialIcons name="sports-martial-arts" size={16} color={theme.colors.onSecondary} />
            <Text style={styles.attackBtnText}>Atacar Boss</Text>
          </TouchableOpacity>
        </View>

        {/* Boss HP Bar */}
        <View style={styles.bossHpTrack}>
          <View style={[styles.bossHpFill, { width: `${bossHpPercent}%` }]} />
        </View>

        {/* Combat Actions */}
        <View style={styles.combatActionsRow}>
          <Text style={styles.attackHint}>{attackHint}</Text>
          <View style={styles.combatButtons}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleHeal} activeOpacity={0.7}>
              <MaterialIcons name="healing" size={14} color={theme.colors.tertiary} />
              <Text style={[styles.secondaryBtnText, { color: theme.colors.tertiary }]}>Curar</Text>
            </TouchableOpacity>
            {combat.bossHp <= 0 && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleResetBoss} activeOpacity={0.7}>
                <MaterialIcons name="replay" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.secondaryBtnText}>Revivir Boss</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Combat Feedback Notification (leído del combatSlice) */}
        {combat.lastCombatFeedback !== '' && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{combat.lastCombatFeedback}</Text>
          </View>
        )}
      </View>

      {/* Live Action Stream Ticker */}
      <View style={styles.streamSection}>
        <View style={styles.streamHeader}>
          <Text style={styles.streamLabel}>LIVE ACTION STREAM (TIEMPO REAL)</Text>
          <Text style={styles.streamDispatchCode}>Store.dispatch()</Text>
        </View>

        <View style={styles.streamContainer}>
          {recentActions.length === 0 ? (
            <View style={styles.emptyStreamBox}>
              <Text style={styles.emptyStreamText}>
                Esperando despachos de acciones... Realiza cambios en los paneles para ver mutaciones en vivo.
              </Text>
            </View>
          ) : (
            recentActions.map((log, index) => {
              const isFirst = index === 0;
              let dotColor = theme.colors.outline;
              if (log.category === 'stats') dotColor = theme.colors.primary;
              else if (log.category === 'inventory') dotColor = theme.colors.tertiary;
              else if (log.category === 'combat') dotColor = theme.colors.secondary;

              return (
                <View key={log.id} style={[styles.logRow, isFirst && styles.logRowFirst]}>
                  <View style={styles.logLeft}>
                    <View style={[styles.logDot, { backgroundColor: dotColor }]} />
                    <Text style={styles.logType} numberOfLines={1}>
                      [{log.type}]
                      {log.displayPayload !== '{}' && (
                        <Text style={styles.logPayload}> -&gt; {log.displayPayload}</Text>
                      )}
                    </Text>
                  </View>

                  <View style={styles.logRight}>
                    <View style={styles.diffBadge}>
                      <Text style={styles.diffBadgeText}>{log.diff}</Text>
                    </View>
                    <Text style={styles.logTimestamp}>{log.timestamp}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sliceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sliceTagText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  zoneText: {
    fontSize: 10,
    color: theme.colors.outline,
    fontWeight: '700',
  },
  devtoolsBridge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bridgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  bridgeText: {
    fontSize: 10,
    color: theme.colors.tertiary,
    fontWeight: '600',
  },
  bossCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  bossTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bossIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bossAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  bossAvatar: {
    fontSize: 24,
    lineHeight: 38,
    textAlign: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  combatActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  attackHint: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  combatButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
  },
  secondaryBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  logPayload: {
    color: theme.colors.tertiary,
  },
  bossTexts: {
    flex: 1,
  },
  bossTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bossName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  bossTag: {
    backgroundColor: theme.colors.errorContainer,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  bossTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.error,
    fontFamily: 'monospace',
  },
  bossHpText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  attackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  attackBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onSecondary,
    textTransform: 'uppercase',
  },
  bossHpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  bossHpFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
  },
  feedbackBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: theme.borderRadius.sm,
    padding: 6,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.secondary,
    fontFamily: 'monospace',
  },
  streamSection: {
    gap: 8,
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  streamDispatchCode: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    fontWeight: '600',
  },
  streamContainer: {
    gap: 6,
  },
  emptyStreamBox: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.sm,
    padding: 12,
    alignItems: 'center',
  },
  emptyStreamText: {
    fontSize: 10,
    color: theme.colors.outline,
    textAlign: 'center',
    lineHeight: 14,
  },
  logRow: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logRowFirst: {
    backgroundColor: 'rgba(38, 42, 52, 0.85)',
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.primary,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  logDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  logType: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  logRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diffBadge: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  diffBadgeText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.tertiary,
    fontWeight: '700',
  },
  logTimestamp: {
    fontSize: 9,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
});
