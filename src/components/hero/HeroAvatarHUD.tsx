import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAppSelector } from '../../store';
import {
  selectHeroComputedStatus,
  selectStats,
  selectHpStatus,
  selectMana,
  selectEquippedWeapon,
} from '../../store/selectors';
import { HpStatus } from '../../types';

const EXPRESSIONS: Record<HpStatus, string> = {
  SANO: '😎',
  HERIDO: '😣',
  DERROTADO: '💀',
};

export const HeroAvatarHUD: React.FC = () => {
  const stats = useAppSelector(selectStats);
  const status = useAppSelector(selectHeroComputedStatus);
  const hpStatus = useAppSelector(selectHpStatus);
  const mana = useAppSelector(selectMana);
  const weapon = useAppSelector(selectEquippedWeapon);

  const hpPercent = Math.max(0, Math.min(100, (stats.currentHp / stats.maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (mana.currentMp / mana.maxMp) * 100));
  const hpBarColor = hpStatus === 'HERIDO' ? theme.colors.amber : theme.colors.secondary;
  const weightPercent = Math.max(0, Math.min(100, (status.totalWeight / status.maxWeightCapacity) * 100));

  // Determine weight bar color
  let weightBarColor = theme.colors.tertiary;
  if (status.isOverloaded) {
    weightBarColor = theme.colors.secondary;
  } else if (weightPercent > 70) {
    weightBarColor = theme.colors.amber;
  }

  return (
    <View style={styles.card}>
      {/* Zone Header Tag */}
      <View style={styles.headerRow}>
        <View style={styles.selectorTag}>
          <Text style={styles.selectorTagText}>useSelector(selectHeroComputedStatus)</Text>
          <Text style={styles.zoneText}>ZONA A</Text>
        </View>

        <View style={styles.syncPill}>
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>
            {hpStatus}
          </Text>
        </View>
      </View>

      {/* Hero Profile Row */}
      <View style={styles.profileRow}>
        {/* Dynamic Aura Avatar */}
        <View style={[styles.avatarAura, { borderColor: status.auraColor, shadowColor: status.auraColor }]}>
          <View style={[styles.avatarInner, { backgroundColor: `${status.auraColor}22` }]}>
            {/* Aspecto según la clase + expresión según el HP */}
            <Text style={[styles.avatarEmoji, hpStatus === 'HERIDO' && styles.avatarHurt]}>
              {status.heroEmoji}
            </Text>
            <Text style={styles.expressionEmoji}>{EXPRESSIONS[hpStatus]}</Text>
            {status.isDefeated && (
              <View style={styles.defeatedOverlay}>
                <MaterialIcons name="dangerous" size={24} color={theme.colors.secondary} />
              </View>
            )}
          </View>

          <View style={[styles.classIconBadge, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
            <MaterialIcons
              name={status.heroIcon as keyof typeof MaterialIcons.glyphMap}
              size={14}
              color={status.auraColor}
            />
          </View>

          {/* Arma en mano */}
          {weapon && (
            <View style={[styles.weaponBadge, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
              <MaterialIcons
                name={weapon.icon as keyof typeof MaterialIcons.glyphMap}
                size={14}
                color={theme.colors.onSurface}
              />
            </View>
          )}
        </View>

        {/* Identity & Combat Power */}
        <View style={styles.identityCol}>
          <View style={styles.nameRow}>
            <Text style={styles.heroName}>Vaelin Ashthorne</Text>
            <View style={styles.lvlBadge}>
              <Text style={styles.lvlText}>LVL 12</Text>
            </View>
          </View>

          {/* Dynamic Class Badge */}
          <View style={[styles.classBadge, { backgroundColor: `${status.auraColor}20` }]}>
            <Text style={[styles.classBadgeText, { color: status.auraColor }]}>
              {status.heroClass}
            </Text>
          </View>

          {/* Combat Power Metric */}
          <View style={styles.cpContainer}>
            <View>
              <Text style={styles.cpLabel}>COMBAT POWER (SELECTOR)</Text>
              <View style={styles.cpValueRow}>
                <Text style={[styles.cpValue, { color: status.auraColor }]}>
                  {status.combatPower}
                </Text>
                <Text style={styles.cpFormula}>(STR×3 + AGI×2 + INT×3)</Text>
              </View>
            </View>

            {status.isOverloaded && (
              <View style={styles.penaltyBadge}>
                <MaterialIcons name="warning" size={12} color={theme.colors.onSecondary} />
                <Text style={styles.penaltyText}>-30% PWR</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Dynamic Resource Bars */}
      <View style={styles.barsContainer}>
        {/* HP Bar */}
        <View style={styles.barGroup}>
          <View style={styles.barHeader}>
            <View style={styles.barLabelRow}>
              <MaterialIcons name="favorite" size={14} color={hpBarColor} />
              <Text style={[styles.barTitle, { color: hpBarColor }]}>Vida (HP)</Text>
            </View>
            <Text style={styles.barValueText}>
              {stats.currentHp} / {stats.maxHp}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${hpPercent}%`, backgroundColor: hpBarColor },
              ]}
            />
          </View>
        </View>

        {/* MP Bar */}
        <View style={styles.barGroup}>
          <View style={styles.barHeader}>
            <View style={styles.barLabelRow}>
              <MaterialIcons name="bolt" size={14} color={theme.colors.primary} />
              <Text style={[styles.barTitle, { color: theme.colors.primary }]}>Maná / Arcane (MP)</Text>
            </View>
            <Text style={styles.barValueText}>
              {mana.currentMp} / {mana.maxMp}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${mpPercent}%`, backgroundColor: theme.colors.primary },
              ]}
            />
          </View>
        </View>

        {/* Encumbrance Bar */}
        <View style={styles.barGroup}>
          <View style={styles.barHeader}>
            <View style={styles.barLabelRow}>
              <MaterialIcons name="fitness-center" size={14} color={weightBarColor} />
              <Text style={[styles.barTitle, { color: weightBarColor }]}>Carga de Mochila</Text>
            </View>
            <Text style={[styles.barValueText, status.isOverloaded && { color: theme.colors.secondary, fontWeight: '700' }]}>
              {status.totalWeight.toFixed(1)} / {status.maxWeightCapacity.toFixed(1)} Kg
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.min(100, weightPercent)}%`, backgroundColor: weightBarColor },
              ]}
            />
          </View>
        </View>

        {/* Overencumbered Alert Banner */}
        {status.isOverloaded && (
          <View style={styles.overencumberedAlert}>
            <View style={styles.alertLeft}>
              <MaterialIcons name="report" size={18} color={theme.colors.secondary} />
              <Text style={styles.alertText}>¡SOBRECARGADO! (-30% Poder, -50% Vel)</Text>
            </View>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>CAP EXCEDIDA</Text>
            </View>
          </View>
        )}
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
  selectorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorTagText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.primary,
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
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  syncText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.tertiary,
    letterSpacing: 0.5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: 4,
  },
  avatarAura: {
    width: 76,
    height: 76,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    padding: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  avatarEmoji: {
    flex: 1,
    fontSize: 38,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 68,
  },
  avatarHurt: {
    opacity: 0.6,
  },
  expressionEmoji: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 16,
  },
  weaponBadge: {
    position: 'absolute',
    bottom: -6,
    left: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defeatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classIconBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  identityCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  lvlBadge: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  lvlText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  classBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 3,
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cpContainer: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cpLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  cpValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 1,
  },
  cpValue: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  cpFormula: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  penaltyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  penaltyText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.onSecondary,
  },
  barsContainer: {
    marginTop: theme.spacing.md,
    gap: 10,
  },
  barGroup: {
    gap: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  barValueText: {
    fontSize: 11,
    color: theme.colors.onSurface,
    fontFamily: 'monospace',
  },
  barTrack: {
    height: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  overencumberedAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: theme.borderRadius.md,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  alertText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.secondary,
    letterSpacing: 0.3,
  },
  alertBadge: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  alertBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.secondary,
    fontFamily: 'monospace',
  },
});
