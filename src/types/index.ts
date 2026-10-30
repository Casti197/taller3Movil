export type StatKey = 'str' | 'agi' | 'int';

export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';

export type ItemCategory = 'weapons' | 'shields' | 'armor' | 'accessories' | 'relics';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  bonusHp?: number;
  weight: number;
  rarity: 'Común' | 'Raro' | 'Legendario';
  slot: 'Mano P.' | 'Mano S.' | 'Pecho' | 'Botas' | 'Reliquia';
}

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
}

export interface InventoryState {
  catalog: InventoryItem[];
  equippedIds: string[];
}

export interface ActionLogEntry {
  id: string;
  type: string;
  payloadStr: string;
  diff: string;
  timestamp: string;
  category: 'stats' | 'inventory' | 'combat' | 'system';
}

export interface CombatState {
  bossHp: number;
  bossMaxHp: number;
  lastDamageDealt: number;
  lastCombatFeedback: string;
}

export interface DerivedHeroStatus {
  totalStr: number;
  totalAgi: number;
  totalInt: number;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  totalWeight: number;
  maxWeightCapacity: number;
  isOverloaded: boolean;
  heroClass: string;
  heroIcon: string;
  auraColor: string;
  rawPower: number;
  combatPower: number;
  isDefeated: boolean;
  encumbranceRatio: number;
}
