import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type NavTab = 'console' | 'tree' | 'dispatch' | 'inventory' | 'academy';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: NavTab; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'console', label: 'Console', icon: 'sports-martial-arts' },
    { key: 'tree', label: 'State Tree', icon: 'account-tree' },
    { key: 'dispatch', label: 'Dispatch', icon: 'bolt' },
    { key: 'inventory', label: 'Inventory', icon: 'shield' },
    { key: 'academy', label: 'Academy', icon: 'menu-book' },
  ];

  return (
    <View style={styles.container}>
      {/* Telemetry subheader row */}
      <View style={styles.telemetryRow}>
        <View style={styles.slicesRow}>
          <Text style={styles.slicesLabel}>SLICES</Text>
          <View style={styles.slicePill}>
            <Text style={[styles.sliceText, { color: theme.colors.primary }]}>statsSlice</Text>
          </View>
          <View style={styles.slicePill}>
            <Text style={[styles.sliceText, { color: theme.colors.tertiary }]}>inventorySlice</Text>
          </View>
          <View style={styles.slicePill}>
            <Text style={[styles.sliceText, { color: theme.colors.secondary }]}>actionLogSlice</Text>
          </View>
        </View>

        <View style={styles.streamStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>STREAM: OK</Text>
        </View>
      </View>

      {/* Main Tabs Navigation */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 14, 23, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 8,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingTop: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  slicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slicesLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.outline,
    marginRight: 4,
    letterSpacing: 0.5,
  },
  slicePill: {
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  sliceText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  streamStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tertiary,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
    height: 46,
    borderRadius: theme.borderRadius.md,
    gap: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(38, 42, 52, 0.9)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
