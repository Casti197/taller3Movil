import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAppDispatch } from '../store';
import { resetHeroForgeStore } from '../store';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetHeroForgeStore());
  };

  const getSubtitle = () =>
    currentTab === 'dispatch' ? 'RTK Dispatch Studio' : 'Hero Console & State Bridge';

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>HeroForge RPG</Text>
          <View style={styles.rtkBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.rtkText}>RTK ACTIVE</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleReset}
          style={styles.iconButton}
          activeOpacity={0.7}
          accessibilityLabel="Reset Redux Store"
        >
          <MaterialIcons name="restart-alt" size={20} color={theme.colors.secondary} />
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={18} color={theme.colors.onPrimary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: 'rgba(15, 19, 28, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  leftCol: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.3,
  },
  rtkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  rtkText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.tertiary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(38, 42, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: theme.colors.primary,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
});
