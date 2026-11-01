import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectInventory,
  selectIsOverencumbered,
  selectTotalWeight,
  selectMaxWeightCapacity,
} from '../../store/selectors';
import { toggleEquipItem, clearEquipment } from '../../store/slices/inventorySlice';
import { InventoryItem } from '../../types';

export const ArmoryGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectInventory);
  const isOverloaded = useAppSelector(selectIsOverencumbered);
  const totalWeight = useAppSelector(selectTotalWeight);
  const maxWeightCapacity = useAppSelector(selectMaxWeightCapacity);

  const handleToggle = (itemId: string) => {
    dispatch(toggleEquipItem(itemId));
  };

  const handleClear = () => {
    dispatch(clearEquipment());
  };

  const renderStatBonus = (item: InventoryItem) => {
    if (item.bonusStr > 0) return `+${item.bonusStr} STR`;
    if (item.bonusAgi > 0) return `+${item.bonusAgi} AGI`;
    if (item.bonusInt > 0) return `+${item.bonusInt} INT`;
    return 'Especial';
  };

  const getStatColor = (item: InventoryItem) => {
    if (item.bonusStr > 0) return theme.colors.secondary;
    if (item.bonusAgi > 0) return theme.colors.tertiary;
    if (item.bonusInt > 0) return theme.colors.primary;
    return theme.colors.onSurface;
  };

  return (
    <View style={styles.card}>
      {/* Zone Header Tag */}
      <View style={styles.headerRow}>
        <View style={styles.sliceTag}>
          <Text style={styles.sliceTagText}>inventorySlice.ts</Text>
          <Text style={styles.zoneText}>ZONA C</Text>
        </View>

        <TouchableOpacity onPress={handleClear} style={styles.clearBtn} activeOpacity={0.7}>
          <MaterialIcons name="remove-shopping-cart" size={13} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.clearBtnText}>Desequipar Todo</Text>
        </TouchableOpacity>
      </View>

      {/* Subheader Counter */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Toca para equipar o guardar en el alijo:</Text>
        <Text style={styles.equippedCountText}>
          {inventory.equippedIds.length} / {inventory.catalog.length} Equipados
        </Text>
      </View>

      {/* Overencumbered Alert */}
      {isOverloaded && (
        <View style={styles.overloadAlert}>
          <MaterialIcons name="report" size={18} color={theme.colors.secondary} />
          <View style={styles.overloadTexts}>
            <Text style={styles.overloadTitle}>¡SOBRECARGADO! (-50% Velocidad)</Text>
            <Text style={styles.overloadSub}>
              {totalWeight} / {maxWeightCapacity} Kg — sube STR o desequipa algo
            </Text>
          </View>
        </View>
      )}

      {/* 2-Column Grid */}
      <View style={styles.grid}>
        {inventory.catalog.map((item) => {
          const isEquipped = inventory.equippedIds.includes(item.id);
          const statColor = getStatColor(item);

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isEquipped && styles.itemCardEquipped]}
              onPress={() => handleToggle(item.id)}
              activeOpacity={0.75}
            >
              {/* Item Card Top */}
              <View style={styles.itemCardTop}>
                <View
                  style={[
                    styles.itemIconBox,
                    { backgroundColor: `${statColor}20` },
                    isEquipped && { backgroundColor: `${theme.colors.primary}30` },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as keyof typeof MaterialIcons.glyphMap}
                    size={20}
                    color={isEquipped ? theme.colors.primary : statColor}
                  />
                </View>

                {isEquipped && (
                  <View style={styles.equippedBadge}>
                    <Text style={styles.equippedBadgeText}>EQUIPADO</Text>
                  </View>
                )}
              </View>

              {/* Item Card Info */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>

                <View style={styles.itemDetailsRow}>
                  <Text style={[styles.itemStatBonus, { color: statColor }]}>
                    {renderStatBonus(item)}
                  </Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text
                    style={[
                      styles.itemWeight,
                      item.weight >= 20 && { color: theme.colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {item.weight} Kg {item.weight >= 20 ? '⚠️' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    color: theme.colors.tertiary,
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  clearBtnText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
  equippedCountText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.primary,
  },
  overloadAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    marginBottom: 10,
  },
  overloadTexts: {
    flex: 1,
  },
  overloadTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  overloadSub: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemCard: {
    width: '48%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'space-between',
    minHeight: 96,
  },
  itemCardEquipped: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  itemCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemIconBox: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equippedBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  equippedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.onPrimary,
    fontFamily: 'monospace',
  },
  itemInfo: {
    marginTop: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  itemStatBonus: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  dotSeparator: {
    fontSize: 10,
    color: theme.colors.outline,
  },
  itemWeight: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
});
