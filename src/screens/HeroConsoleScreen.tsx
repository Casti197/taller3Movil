import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { HeroAvatarHUD } from '../components/hero/HeroAvatarHUD';
import { StatsControlPanel } from '../components/stats/StatsControlPanel';
import { ArmoryGrid } from '../components/inventory/ArmoryGrid';
import { ReduxLiveInspector } from '../components/arena/ReduxLiveInspector';

export const HeroConsoleScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Pedagogical Banner */}
      <View style={styles.pedagogicalBanner}>
        <View style={styles.bannerLeft}>
          <View style={styles.bannerIconBox}>
            <MaterialIcons name="hub" size={16} color={theme.colors.primary} />
          </View>
          <View style={styles.bannerTexts}>
            <Text style={styles.bannerTitle}>REDUX SINGLE SOURCE OF TRUTH</Text>
            <Text style={styles.bannerSub}>0 Prop-Drilling • Slices Reactivos • Selectors Derivados</Text>
          </View>
        </View>

        <View style={styles.bannerBadge}>
          <View style={styles.pingDot} />
          <Text style={styles.badgeText}>DEVTOOLS: LIVE</Text>
        </View>
      </View>

      {/* Zona A: Avatar & HUD Superior */}
      <HeroAvatarHUD />

      {/* Zona B: Panel de Atributos (STR, AGI, INT) */}
      <StatsControlPanel />

      {/* Zona C: Armería & Mochila */}
      <ArmoryGrid />

      {/* Zona D: Arena de Simulación & Inspector Redux en Vivo */}
      <ReduxLiveInspector />
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
  pedagogicalBanner: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bannerIconBox: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTexts: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  bannerSub: {
    fontSize: 9,
    color: theme.colors.onSurfaceVariant,
    marginTop: 1,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  pingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.tertiary,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.tertiary,
    fontFamily: 'monospace',
  },
});
