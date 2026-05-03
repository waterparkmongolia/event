import { useState, useCallback, useEffect, useRef } from 'react';
import { UserStats, Prize, PrizePool } from '../types';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

const DEFAULT_STATS: UserStats = {
  points: 1000,
  balance: 0,
  totalEarnings: 0,
  dollarBalance: 0,
  totalDollarEarnings: 0,
  goldenKeys: 1,
  silverKeys: 1,
  tickets: 0,
  tickets2027: 0,
  soldTicketsCount: 450,
  inventory: [],
  customPools: [],
};

function dbRowToStats(row: Record<string, unknown>): UserStats {
  return {
    points: row.points as number,
    balance: row.balance as number,
    totalEarnings: row.total_earnings as number,
    dollarBalance: row.dollar_balance as number,
    totalDollarEarnings: row.total_dollar_earnings as number,
    goldenKeys: row.golden_keys as number,
    silverKeys: row.silver_keys as number,
    tickets: row.tickets as number,
    tickets2027: row.tickets2027 as number,
    soldTicketsCount: row.sold_tickets_count as number,
    inventory: (row.inventory as string[]) || [],
    customPools: (row.custom_pools as PrizePool[]) || [],
  };
}

function statsToDbRow(userId: string, stats: UserStats) {
  return {
    user_id: userId,
    points: stats.points,
    balance: stats.balance,
    total_earnings: stats.totalEarnings,
    dollar_balance: stats.dollarBalance,
    total_dollar_earnings: stats.totalDollarEarnings,
    golden_keys: stats.goldenKeys,
    silver_keys: stats.silverKeys,
    tickets: stats.tickets,
    tickets2027: stats.tickets2027,
    sold_tickets_count: stats.soldTicketsCount,
    inventory: stats.inventory,
    custom_pools: stats.customPools || [],
    updated_at: new Date().toISOString(),
  };
}

export function useGameState(userId: string) {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoaded(false);
    supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        if (data) setStats(dbRowToStats(data));
        setLoaded(true);
      });
  }, [userId]);

  useEffect(() => {
    if (!loaded || !userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase.from('game_stats').upsert(statsToDbRow(userId, stats));
    }, 1000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [stats, userId, loaded]);

  const earnSilverKeys = useCallback((count: number) => {
    setStats(prev => ({ ...prev, silverKeys: prev.silverKeys + count }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#cbd5e1', '#94a3b8'] });
  }, []);

  const earnGoldenKeys = useCallback((count: number) => {
    setStats(prev => ({ ...prev, goldenKeys: prev.goldenKeys + count }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b'] });
  }, []);

  const addCustomPool = useCallback((pool: PrizePool) => {
    setStats(prev => ({ ...prev, customPools: [...(prev.customPools || []), pool] }));
  }, []);

  const rollPrize = useCallback((prizes: Prize[]) => {
    const rand = Math.random();
    let cumulative = 0;
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (rand < cumulative) return prize;
    }
    return prizes[prizes.length - 1];
  }, []);

  const openPool = useCallback((pool: PrizePool, count: number = 1) => {
    const totalPoints  = (pool.cost.points      || 0) * count;
    const totalGold    = (pool.cost.goldenKeys   || 0) * count;
    const totalSilver  = (pool.cost.silverKeys   || 0) * count;
    const totalTickets = (pool.cost.tickets      || 0) * count;
    const total2027    = (pool.cost.tickets2027  || 0) * count;

    if (
      stats.points      < totalPoints  ||
      stats.goldenKeys  < totalGold    ||
      stats.silverKeys  < totalSilver  ||
      stats.tickets     < totalTickets ||
      stats.tickets2027 < total2027
    ) {
      alert('Танд хангалттай нөөц байхгүй байна.');
      return null;
    }

    const results: Prize[] = Array.from({ length: count }, () => rollPrize(pool.prizes));

    setStats(prev => {
      const next = {
        ...prev,
        points:      prev.points      - totalPoints,
        goldenKeys:  prev.goldenKeys  - totalGold,
        silverKeys:  prev.silverKeys  - totalSilver,
        tickets:     prev.tickets     - totalTickets,
        tickets2027: prev.tickets2027 - total2027,
      };
      const newInventory = [...next.inventory];

      results.forEach(prize => {
        if (prize.points) next.points += prize.points;
        if (prize.money)  { next.balance += prize.money; next.totalEarnings += prize.money; }
        if (prize.items) {
          if (prize.items.includes('Golden Key'))      { next.goldenKeys  += 1; confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 }, colors: ['#fbbf24','#f59e0b'] }); }
          if (prize.items.includes('Ticket 2026'))     { next.tickets     += 1; confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 }, colors: ['#22d3ee','#0891b2'] }); }
          if (prize.items.includes('Super Ticket 2027')) { next.tickets2027 += 1; confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, colors: ['#a855f7','#fb7185'] }); }
          newInventory.push(...prize.items);
        } else if (!prize.points && prize.id !== 'points_var') {
          newInventory.push(prize.name);
          if (['legendary','epic','rare'].includes(prize.rarity)) confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
        }
      });

      next.inventory = newInventory;
      return next;
    });

    return results;
  }, [stats, rollPrize]);

  const purchaseItem = useCallback((costPoints: number, resultType: 'goldenKeys' | 'silverKeys' | 'tickets') => {
    if (stats.points < costPoints) { alert('Хангалттай оноо байхгүй байна.'); return false; }
    if (resultType === 'tickets' && stats.soldTicketsCount >= 1000) {
      alert('Тасалбарын хязгаар (1,000) дууссан байна.');
      return false;
    }
    setStats(prev => ({
      ...prev,
      points: prev.points - costPoints,
      [resultType]: prev[resultType] + 1,
      soldTicketsCount: resultType === 'tickets' ? prev.soldTicketsCount + 1 : prev.soldTicketsCount,
    }));
    confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 } });
    return true;
  }, [stats.points, stats.soldTicketsCount]);

  const sellItem = useCallback((type: 'tickets', rewardAmount: number, rewardType: 'points' | 'balance') => {
    if (stats[type] <= 0) return false;
    setStats(prev => ({
      ...prev,
      [type]: prev[type] - 1,
      [rewardType]: prev[rewardType] + rewardAmount,
      totalEarnings: rewardType === 'balance' ? prev.totalEarnings + rewardAmount : prev.totalEarnings,
    }));
    alert(`1 Тасалбар амжилттай зарагдлаа!`);
    return true;
  }, [stats]);

  return { stats, loaded, openPool, addCustomPool, earnSilverKeys, earnGoldenKeys, purchaseItem, sellItem };
}
