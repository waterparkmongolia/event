export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Prize {
  id: string;
  name: string;
  probability: number;
  points?: number;
  money?: number;
  items?: string[];
  rarity: Rarity;
}

export interface PrizePool {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: 'starter' | 'super' | 'custom';
  cost: {
    points?: number;
    goldenKeys?: number;
    silverKeys?: number;
    tickets?: number;
    tickets2027?: number;
  };
  prizes: Prize[];
}

export interface UserStats {
  points: number;
  balance: number;
  totalEarnings: number;
  dollarBalance: number;
  totalDollarEarnings: number;
  goldenKeys: number;
  silverKeys: number;
  tickets: number;
  tickets2027: number;
  soldTicketsCount: number;
  inventory: string[];
  customPools?: PrizePool[];
}

export const STARTER_PRIZES: Prize[] = [
  { id: 'ticket_2026', name: 'Тасалбар 2026', probability: 0.005, rarity: 'legendary', items: ['Ticket 2026'] },
  { id: 'gold_key', name: 'Алтан Түлхүүр', probability: 0.001, rarity: 'legendary', items: ['Golden Key'] },
  { id: 'reg_1000', name: '1,000 Points', probability: 0.009, points: 1000, rarity: 'epic' },
  { id: 'reg_100', name: '100 Points', probability: 0.09, points: 100, rarity: 'rare' },
  { id: 'reg_10', name: '10 Points', probability: 0.25, points: 10, rarity: 'uncommon' },
  { id: 'reg_1', name: '1 Point', probability: 0.65, points: 1, rarity: 'common' },
];

export const SUPER_PRIZES: Prize[] = [
  { id: 'apt', name: '3 өрөө байр', probability: 0.00, rarity: 'legendary' },
  { id: 'prius', name: 'Toyota Prius 41 Alpha', probability: 0.00, rarity: 'legendary' },
  { id: 'mac_pro', name: 'MacBook Pro 14" M3 Max', probability: 0.0001, rarity: 'epic' },
  { id: 'mac_air', name: 'MacBook Air M3', probability: 0.0001, rarity: 'epic' },
  { id: 'iphone_pro', name: 'iPhone 15 Pro', probability: 0.0001, rarity: 'rare' },
  { id: 'iphone_15', name: 'iPhone 15', probability: 0.0001, rarity: 'rare' },
  { id: '100k', name: '100,000₮', probability: 0.0096, money: 100000, rarity: 'rare' },
  { id: '10k', name: '10,000₮', probability: 0.02, money: 10000, rarity: 'uncommon' },
  { id: '1k', name: '1,000₮', probability: 0.05, money: 1000, rarity: 'uncommon' },
  { id: '100p', name: '100₮', probability: 0.1, money: 100, rarity: 'common' },
  { id: '10p', name: '10₮', probability: 0.3, money: 10, rarity: 'common' },
  { id: '1p', name: '1₮', probability: 0.519, money: 1, rarity: 'common' },
  { id: 'ticket_2027', name: 'Super Ticket 2027', probability: 0.001, rarity: 'legendary', items: ['Super Ticket 2027'] },
];

export const SUPER_PRIZES_2027: Prize[] = [
  { id: 'apt_2027', name: '3 өрөө байр (2027)', probability: 0.00, rarity: 'legendary' },
  { id: 'land_300', name: 'Land Cruiser 300', probability: 0.0001, rarity: 'legendary' },
  { id: 'mac_pro_m4', name: 'MacBook Pro M4', probability: 0.0005, rarity: 'epic' },
  { id: 'iphone_16_pro', name: 'iPhone 16 Pro', probability: 0.001, rarity: 'rare' },
  { id: '1m_cash', name: '1,000,000₮', probability: 0.005, money: 1000000, rarity: 'rare' },
  { id: '100k_cash', name: '100,000₮', probability: 0.05, money: 100000, rarity: 'uncommon' },
  { id: '10k_cash', name: '10,000₮', probability: 0.2, money: 10000, rarity: 'common' },
  { id: '1k_cash', name: '1,000₮', probability: 0.7434, money: 1000, rarity: 'common' },
];

export const DEFAULT_STARTER_POOL: PrizePool = {
  id: 'starter',
  name: 'Starter Prize Pool',
  type: 'starter',
  description: '1 Мөнгөн Түлхүүр ашиглан нээх боломжтой.',
  image: 'https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?auto=format&fit=crop&q=80&w=800',
  cost: { silverKeys: 1 },
  prizes: STARTER_PRIZES,
};

export const DEFAULT_SUPER_POOL: PrizePool = {
  id: 'super',
  name: 'Super Prize Pool 2026',
  type: 'super',
  description: 'Тасалбар авсан байх шаардлагатай. Алтан Түлхүүр ашиглан нээх боломжтой.',
  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
  cost: { goldenKeys: 1 },
  prizes: SUPER_PRIZES,
};

export const DEFAULT_SUPER_POOL_2027: PrizePool = {
  id: 'super_2027',
  name: 'Super Prize Pool 2027',
  type: 'super',
  description: 'Зөвхөн 2027 онд орох боломжтой. Super Ticket 2027 шаардлагатай.',
  image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
  cost: { tickets2027: 1 },
  prizes: SUPER_PRIZES_2027,
};
