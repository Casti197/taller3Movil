import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectStats, selectHeroComputedStatus } from '../../store/selectors';
import {
  incrementStat,
  decrementStat,
  applyBuildPreset,
  resetStats,
} from '../../store/slices/statsSlice';
import { StatKey, BuildPreset } from '../../types';

export const StatsControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectStats);
  const status = useAppSelector(selectHeroComputedStatus);

  const handleIncrement = (stat: StatKey) => {
    dispatch(incrementStat(stat));
  };

  const handleDecrement = (stat: StatKey) => {
    dispatch(decrementStat(stat));
  };

  const handlePreset = (preset: BuildPreset) => {
    dispatch(applyBuildPreset(preset));
  };

  const handleReset = () => {
    dispatch(resetStats());
  };

  const statConfigs: {
    key: StatKey;
    label: string;
    sublabel: string;
    color: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    bonus: number;
  }[] = [
    {
      key: 'str',
      label: 'Fuerza (STR)',
      sublabel: 'Aumenta Poder y Capacidad Carga (+2kg/pt)',
      color: theme.colors.secondary,
      icon: 'fitness-center',
      bonus: status.bonusStr,
    },
    {
      key: 'agi',
      label: 'Agilidad (AGI)',
      sublabel: 'Aumenta Evasión y Daño Crítico',
      color: theme.colors.tertiary,
      icon: 'flash-on',
      bonus: status.bonusAgi,
    },
    {
      key: 'int',
      label: 'Inteligencia (INT)',
      sublabel: 'Potencia Hechizos y Capacidad de Maná',
      color: theme.colors.primary,
      icon: 'auto-fix-high',
      bonus: status.bonusInt,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Zone Header Tag */}
      <View style={styles.headerRow}>
        <View style={styles.sliceTag}>
          <Text style={styles.sliceTagText}>statsSlice.ts</Text>
          <Text style={styles.zoneText}>ZONA B</Text>
        </View>

        {/* Available Points Badge */}
        <View style={styles.pointsBadge}>
          <MaterialIcons name="diamond" size={14} color={theme.colors.primary} />
          <Text style={styles.pointsLabel}>Puntos:</Text>
          <Text style={styles.pointsValue}>{stats.availablePoints} pts</Text>
        </View>
      </View>

      {/* Attribute Steppers */}
      <View style={styles.steppersContainer}>
        {statConfigs.map((cfg) => {
          const val = stats[cfg.key];
          const canIncrement = stats.availablePoints > 0;
          const canDecrement = val > 5;
          const meterPercent = Math.min(100, (val / 25) * 100);

          return (
            <View key={cfg.key} style={styles.stepperCard}>
              <View style={styles.stepperTop}>
                {/* Icon & Label */}
                <View style={styles.labelCol}>
                  <View style={[styles.statIconBox, { backgroundColor: `${cfg.color}25` }]}>
                    <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
                  </View>
                  <View style={styles.statTexts}>
                    <View style={styles.statTitleRow}>
                      <Text style={styles.statTitle}>{cfg.label}</Text>
                      {cfg.bonus > 0 ? (
                        <View style={styles.bonusChip}>
                          <Text style={styles.bonusChipText}>+{cfg.bonus} Arma</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.statSublabel}>{cfg.sublabel}</Text>
                  </View>
                </View>

                {/* Counter Controls */}
                <View style={styles.controlsRow}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, !canDecrement && styles.stepperBtnDisabled]}
                    onPress={() => handleDecrement(cfg.key)}
                    disabled={!canDecrement}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="remove"
                      size={18}
                      color={canDecrement ? theme.colors.onSurface : theme.colors.outline}
                    />
                  </TouchableOpacity>

                  <Text style={styles.statValueDisplay}>{val}</Text>

                  <TouchableOpacity
                    style={[styles.stepperBtnAdd, !canIncrement && styles.stepperBtnDisabled]}
                    onPress={() => handleIncrement(cfg.key)}
                    disabled={!canIncrement}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="add"
                      size={18}
                      color={canIncrement ? theme.colors.onPrimary : theme.colors.outline}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Micro-bar */}
              <View style={styles.microMeterTrack}>
                <View
                  style={[
                    styles.microMeterFill,
                    { width: `${meterPercent}%`, backgroundColor: cfg.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Archetype Quick Action Presets */}
      <View style={styles.presetsSection}>
        <View style={styles.presetsHeaderRow}>
          <Text style={styles.presetsLabel}>PRESETS DE ARQUETIPOS (ACTION CREATORS)</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
            <MaterialIcons name="restart-alt" size={14} color={theme.colors.secondary} />
            <Text style={styles.resetBtnText}>Poción Reseteo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presetButtonsRow}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handlePreset('WARRIOR')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="shield" size={20} color={theme.colors.secondary} />
            <Text style={styles.presetBtnTitle}>Guerrero</Text>
            <Text style={styles.presetBtnSub}>STR +10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handlePreset('MAGE')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="auto-fix-high" size={20} color={theme.colors.primary} />
            <Text style={styles.presetBtnTitle}>Mago</Text>
            <Text style={styles.presetBtnSub}>INT +10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handlePreset('ROGUE')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="flash-on" size={20} color={theme.colors.tertiary} />
            <Text style={styles.presetBtnTitle}>Pícaro</Text>
            <Text style={styles.presetBtnSub}>AGI +10</Text>
          </TouchableOpacity>
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
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  pointsLabel: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
  pointsValue: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  steppersContainer: {
    gap: 10,
    marginTop: 4,
  },
  stepperCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 8,
  },
  stepperTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTexts: {
    flex: 1,
  },
  statTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  bonusChip: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  bonusChipText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    fontWeight: '600',
  },
  statSublabel: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnAdd: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statValueDisplay: {
    width: 24,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: 'monospace',
  },
  microMeterTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  microMeterFill: {
    height: '100%',
    borderRadius: 2,
  },
  presetsSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  presetsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  presetsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  presetBtnTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  presetBtnSub: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.outline,
  },
});
