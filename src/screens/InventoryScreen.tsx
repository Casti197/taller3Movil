import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { selectInventory, selectHeroComputedStatus } from '../store/selectors';
import { toggleEquipItem, clearEquipment, generateLoot } from '../store/slices/inventorySlice';
import { ItemCategory, InventoryItem } from '../types';

export const InventoryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectInventory);
  const status = useAppSelector(selectHeroComputedStatus);

  const [activeCategory, setActiveCategory] = useState<'all' | ItemCategory>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggle = (itemId: string, name: string) => {
    dispatch(toggleEquipItem(itemId));
    const wasEquipped = inventory.equippedIds.includes(itemId);
    showToast(wasEquipped ? `Guardado en alijo: ${name}` : `Equipado al rig: ${name}`);
  };

  const handleClearAll = () => {
    dispatch(clearEquipment());
    showToast('Todo el equipamiento ha sido desequipado');
  };

  const handleGenerateLoot = () => {
    dispatch(generateLoot());
    showToast('¡Nuevo botín legendario generado en el alijo!');
  };

  const filteredItems = inventory.catalog.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Calculate encumbrance segment percentages
  const safeWeightLimit = status.maxWeightCapacity * 0.6;
  const heavyWeightLimit = status.maxWeightCapacity;
  const isOver = status.isOverloaded;

  // Active Rig Slots mapping
  const equippedList = inventory.catalog.filter((i) => inventory.equippedIds.includes(i.id));
  const mainHandItem = equippedList.find((i) => i.slot === 'Mano P.');
  const offHandItem = equippedList.find((i) => i.slot === 'Mano S.');
  const chestItem = equippedList.find((i) => i.slot === 'Pecho');
  const bootsItem = equippedList.find((i) => i.slot === 'Botas');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Toast Feedback */}
      {toastMsg && (
        <View style={styles.toast}>
          <MaterialIcons name="verified" size={16} color={theme.colors.tertiary} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Subheader & Telemetry */}
      <View style={styles.header}>
        <View style={styles.streamBadge}>
          <View style={styles.pingDot} />
          <Text style={styles.streamText}>STATE MUTATION STREAM</Text>
          <Text style={styles.versionText}>RTK v2.2</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Armory &amp; Stash</Text>
          <Text style={styles.sliceTag}>inventorySlice.ts</Text>
        </View>
      </View>

      {/* Encumbrance Meter Card */}
      <View style={styles.encumbranceCard}>
        <View style={styles.encumbranceHeader}>
          <View style={styles.encumbranceTitleRow}>
            <MaterialIcons name="scale" size={18} color={theme.colors.primary} />
            <Text style={styles.encumbranceTitle}>ENCUMBRANCE METER</Text>
          </View>
          <View style={styles.selectorPill}>
            <Text style={styles.selectorPillText}>
              selectTotalWeight: {status.totalWeight.toFixed(1)}kg
            </Text>
          </View>
        </View>

        {/* 3-Segment Progress Bar */}
        <View style={styles.encumbranceTrack}>
          <View
            style={[
              styles.encumbranceFill,
              {
                width: `${Math.min(100, (status.totalWeight / status.maxWeightCapacity) * 100)}%`,
                backgroundColor: isOver
                  ? theme.colors.secondary
                  : status.totalWeight > safeWeightLimit
                  ? theme.colors.amber
                  : theme.colors.tertiary,
              },
            ]}
          />
        </View>

        <View style={styles.limitIndices}>
          <Text style={styles.limitText}>0 kg (Ágil)</Text>
          <Text style={styles.limitText}>{safeWeightLimit.toFixed(0)} kg (Carga Media)</Text>
          <Text style={[styles.limitText, { color: theme.colors.secondary, fontWeight: '700' }]}>
            {heavyWeightLimit.toFixed(0)} kg (Límite Máx)
          </Text>
        </View>

        {/* Dynamic Penalty Banner */}
        {isOver ? (
          <View style={styles.penaltyAlert}>
            <MaterialIcons name="warning" size={20} color={theme.colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.penaltyTitle}>
                {status.totalWeight.toFixed(1)} / {status.maxWeightCapacity.toFixed(1)} Kg (SOBRECARGADO)
              </Text>
              <Text style={styles.penaltyDesc}>
                Penalización activa: <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>-30% Poder de Combate</Text>, <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>-50% Velocidad de Evasión</Text>.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.safeAlert}>
            <MaterialIcons name="check-circle" size={18} color={theme.colors.tertiary} />
            <Text style={styles.safeText}>
              Carga óptima: {status.totalWeight.toFixed(1)} kg / {status.maxWeightCapacity.toFixed(1)} kg. Sin penalizaciones de combate.
            </Text>
          </View>
        )}
      </View>

      {/* Active Rig Loadout */}
      <View style={styles.rigSection}>
        <View style={styles.rigHeader}>
          <Text style={styles.rigTitle}>ACTIVE RIG LOADOUT (STATE.EQUIPPED)</Text>
          <Text style={styles.rigCounter}>
            {inventory.equippedIds.length} Slots Activos
          </Text>
        </View>

        <View style={styles.rigSlotsRow}>
          {/* Main Hand */}
          <View style={styles.rigSlotCard}>
            <Text style={styles.slotLabel}>Mano P.</Text>
            <View style={styles.slotIconBox}>
              <MaterialIcons name="sports-martial-arts" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.slotItemName} numberOfLines={1}>
              {mainHandItem ? mainHandItem.name : 'Vacío'}
            </Text>
          </View>

          {/* Off Hand */}
          <View style={styles.rigSlotCard}>
            <Text style={styles.slotLabel}>Mano S.</Text>
            <View style={styles.slotIconBox}>
              <MaterialIcons name="shield" size={20} color={theme.colors.tertiary} />
            </View>
            <Text style={styles.slotItemName} numberOfLines={1}>
              {offHandItem ? offHandItem.name : 'Vacío'}
            </Text>
          </View>

          {/* Chest */}
          <View style={styles.rigSlotCard}>
            <Text style={styles.slotLabel}>Pecho</Text>
            <View style={styles.slotIconBox}>
              <MaterialIcons name="security" size={20} color={theme.colors.secondary} />
            </View>
            <Text style={styles.slotItemName} numberOfLines={1}>
              {chestItem ? chestItem.name : 'Vacío'}
            </Text>
          </View>

          {/* Boots */}
          <View style={styles.rigSlotCard}>
            <Text style={styles.slotLabel}>Botas</Text>
            <View style={styles.slotIconBox}>
              <MaterialIcons name="directions-walk" size={20} color={theme.colors.amber} />
            </View>
            <Text style={styles.slotItemName} numberOfLines={1}>
              {bootsItem ? bootsItem.name : 'Vacío'}
            </Text>
          </View>
        </View>
      </View>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          { key: 'all', label: `Todos (${inventory.catalog.length})` },
          { key: 'weapons', label: 'Armas' },
          { key: 'shields', label: 'Escudos' },
          { key: 'armor', label: 'Armaduras' },
          { key: 'relics', label: 'Reliquias' },
        ].map((f) => {
          const isActive = activeCategory === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setActiveCategory(f.key as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Items Catalog List */}
      <View style={styles.catalogList}>
        {filteredItems.map((item) => {
          const isEquipped = inventory.equippedIds.includes(item.id);

          return (
            <View key={item.id} style={[styles.catalogCard, isEquipped && styles.catalogCardEquipped]}>
              <View style={styles.catalogCardTop}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.itemIconCircle, isEquipped && styles.itemIconCircleEquipped]}>
                    <MaterialIcons
                      name={item.icon as keyof typeof MaterialIcons.glyphMap}
                      size={22}
                      color={isEquipped ? theme.colors.primary : theme.colors.onSurface}
                    />
                  </View>
                  <View style={styles.itemNameCol}>
                    <Text style={styles.cardItemTitle}>{item.name}</Text>
                    <View style={styles.rarityRow}>
                      <View style={styles.rarityBadge}>
                        <Text style={styles.rarityText}>{item.rarity}</Text>
                      </View>
                      <Text style={styles.slotTypeText}>{item.slot}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardHeaderRight}>
                  <Text style={styles.weightBadge}>{item.weight.toFixed(1)} Kg</Text>
                  <Text style={styles.itemIdText}>ID: #{item.id.substring(0, 6)}</Text>
                </View>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>STR</Text>
                  <Text style={[styles.statBoxVal, { color: theme.colors.secondary }]}>
                    {item.bonusStr > 0 ? `+${item.bonusStr}` : '--'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>AGI</Text>
                  <Text style={[styles.statBoxVal, { color: theme.colors.tertiary }]}>
                    {item.bonusAgi > 0 ? `+${item.bonusAgi}` : '--'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>INT</Text>
                  <Text style={[styles.statBoxVal, { color: theme.colors.primary }]}>
                    {item.bonusInt > 0 ? `+${item.bonusInt}` : '--'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>PESO</Text>
                  <Text style={[styles.statBoxVal, item.weight >= 20 && { color: theme.colors.secondary }]}>
                    {item.weight} kg
                  </Text>
                </View>
              </View>

              {/* Action Bottom */}
              <View style={styles.cardActionRow}>
                <View style={styles.equipStatusIndicator}>
                  <View
                    style={[
                      styles.equipDot,
                      { backgroundColor: isEquipped ? theme.colors.tertiary : theme.colors.outline },
                    ]}
                  />
                  <Text style={[styles.equipStatusText, { color: isEquipped ? theme.colors.tertiary : theme.colors.outline }]}>
                    {isEquipped ? 'Equipado en Rig Principal' : 'En Alijo / Stash'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.toggleBtn, isEquipped ? styles.toggleBtnUnequip : styles.toggleBtnEquip]}
                  onPress={() => handleToggle(item.id, item.name)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={isEquipped ? 'inventory' : 'shield'}
                    size={14}
                    color={isEquipped ? theme.colors.onSecondary : theme.colors.onPrimary}
                  />
                  <Text style={isEquipped ? styles.toggleTextUnequip : styles.toggleTextEquip}>
                    {isEquipped ? 'Desequipar a Alijo' : 'Equipar al Rig'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Dispatch Controls & Immer Explanation */}
      <View style={styles.controlsSection}>
        <View style={styles.controlsHeader}>
          <MaterialIcons name="terminal" size={18} color={theme.colors.tertiary} />
          <Text style={styles.controlsTitle}>REDUX ARCHITECTURE: IMMER.JS PIPELINE</Text>
        </View>

        <View style={styles.codeSnippetBox}>
          <Text style={styles.codeSnippetComment}>// Mutación inmutable administrada en inventorySlice.ts:</Text>
          <Text style={styles.codeSnippetCode}>
            toggleEquipItem: (state, action) =&gt; {'{\n'}
            {'  '}const index = state.equippedIds.indexOf(action.payload);{'\n'}
            {'  '}if (index &gt;= 0) state.equippedIds.splice(index, 1);{'\n'}
            {'  '}else state.equippedIds.push(action.payload);{'\n'}
            {'}'}
          </Text>
        </View>

        <View style={styles.actionButtonsGrid}>
          <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll} activeOpacity={0.7}>
            <MaterialIcons name="remove-shopping-cart" size={16} color={theme.colors.secondary} />
            <Text style={styles.clearAllText}>clearEquipment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lootBtn} onPress={handleGenerateLoot} activeOpacity={0.7}>
            <MaterialIcons name="casino" size={16} color={theme.colors.onPrimary} />
            <Text style={styles.lootText}>generateLoot</Text>
          </TouchableOpacity>
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
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.tertiary,
  },
  header: {
    gap: 4,
  },
  streamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.secondary,
  },
  streamText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.secondary,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  sliceTag: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.tertiary,
  },
  encumbranceCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  encumbranceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  encumbranceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  encumbranceTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  selectorPill: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  selectorPillText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    fontWeight: '700',
  },
  encumbranceTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.surfaceContainerLowest,
    overflow: 'hidden',
  },
  encumbranceFill: {
    height: '100%',
    borderRadius: 5,
  },
  limitIndices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  penaltyAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: theme.borderRadius.md,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  penaltyTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  penaltyDesc: {
    fontSize: 9,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 13,
  },
  safeAlert: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safeText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  rigSection: {
    gap: 8,
  },
  rigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rigTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  rigCounter: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.colors.tertiary,
    fontWeight: '700',
  },
  rigSlotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rigSlotCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    alignItems: 'center',
    gap: 4,
  },
  slotLabel: {
    fontSize: 9,
    color: theme.colors.outline,
    fontWeight: '600',
  },
  slotIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotItemName: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  filterRow: {
    gap: 6,
    paddingVertical: 2,
  },
  filterPill: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
  },
  filterPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  filterPillTextActive: {
    color: theme.colors.onPrimary,
    fontWeight: '700',
  },
  catalogList: {
    gap: 10,
  },
  catalogCard: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  catalogCardEquipped: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(28, 31, 41, 0.95)',
  },
  catalogCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  itemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconCircleEquipped: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  itemNameCol: {
    flex: 1,
  },
  cardItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  rarityBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  slotTypeText: {
    fontSize: 9,
    color: theme.colors.outline,
    fontFamily: 'monospace',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  weightBadge: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  itemIdText: {
    fontSize: 8,
    color: theme.colors.outline,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 6,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statBoxLabel: {
    fontSize: 8,
    color: theme.colors.outline,
    fontWeight: '700',
  },
  statBoxVal: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: theme.colors.onSurface,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  equipStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  equipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  equipStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  toggleBtnEquip: {
    backgroundColor: theme.colors.primary,
  },
  toggleBtnUnequip: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  toggleTextEquip: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onPrimary,
    textTransform: 'uppercase',
  },
  toggleTextUnequip: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSecondary,
    textTransform: 'uppercase',
  },
  controlsSection: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 8,
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.tertiary,
    letterSpacing: 0.5,
  },
  codeSnippetBox: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    padding: 8,
    gap: 2,
  },
  codeSnippetComment: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.onSurfaceVariant,
  },
  codeSnippetCode: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    lineHeight: 14,
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  clearAllBtn: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  clearAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  lootBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  lootText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.onPrimary,
  },
});
