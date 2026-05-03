import { useState, useCallback, useEffect } from 'react';
import { UserStats, Prize, PrizePool, SUPER_PRIZES, STARTER_PRIZES } from '../types';
import confetti from 'canvas-confetti';

export function useGameState(username: string) {
  const storageKey = `prize_box_stats_${username}`;

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up jaks_event if it exists in customPools and ensure no duplicates with default IDs
      const defaultIds = ['starter', 'super', 'super_2027'];
      const filteredCustomPools = (parsed.customPools || [])
        .filter((p: PrizePool) => p.id !== 'jaks_event' && !defaultIds.includes(p.id));
      
      // Deduplicate custom pools by ID
      const uniqueCustomPools = filteredCustomPools.filter((pool: PrizePool, index: number, self: PrizePool[]) =>
        index === self.findIndex((p) => p.id === pool.id)
      );

      return {
        points: parsed.points ?? 1000,
        balance: parsed.balance ?? 0,
        totalEarnings: parsed.totalEarnings ?? (parsed.balance ?? 0),
        dollarBalance: parsed.dollarBalance ?? 0,
        totalDollarEarnings: parsed.totalDollarEarnings ?? 0,
        goldenKeys: parsed.goldenKeys ?? 1,
        silverKeys: parsed.silverKeys ?? 0,
        tickets: parsed.tickets ?? 0,
        tickets2027: parsed.tickets2027 ?? 0,
        soldTicketsCount: parsed.soldTicketsCount ?? 450,
        inventory: parsed.inventory ?? [],
        customPools: uniqueCustomPools
      };
    }
    return { 
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
      customPools: [] 
    };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(stats));
  }, [stats, storageKey]);

  const earnSilverKeys = useCallback((count: number) => {
    setStats(prev => ({ ...prev, silverKeys: prev.silverKeys + count }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#cbd5e1', '#94a3b8'] });
  }, []);

  const earnGoldenKeys = useCallback((count: number) => {
    setStats(prev => ({ ...prev, goldenKeys: prev.goldenKeys + count }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b'] });
  }, []);

  const addCustomPool = useCallback((pool: PrizePool) => {
    setStats(prev => ({
      ...prev,
      customPools: [...(prev.customPools || []), pool]
    }));
  }, []);

  const rollPrize = useCallback((prizes: Prize[]) => {
    const rand = Math.random();
    let cumulative = 0;
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (rand < cumulative) {
        return prize;
      }
    }
    return prizes[prizes.length - 1];
  }, []);

  const openPool = useCallback((pool: PrizePool, count: number = 1) => {
    const totalPoints = (pool.cost.points || 0) * count;
    const totalGold = (pool.cost.goldenKeys || 0) * count;
    const totalSilver = (pool.cost.silverKeys || 0) * count;
    const totalTickets = (pool.cost.tickets || 0) * count;
    const totalTickets2027 = (pool.cost.tickets2027 || 0) * count;

    if (stats.points < totalPoints || stats.goldenKeys < totalGold || stats.silverKeys < totalSilver || stats.tickets < totalTickets || stats.tickets2027 < totalTickets2027) {
      alert(`Танд хангалттай нөөц байхгүй байна.`);
      return null;
    }

    // Generate results FIRST, outside of setStats to avoid double-execution in Strict Mode
    const currentResults: Prize[] = [];
    for (let i = 0; i < count; i++) {
        currentResults.push(rollPrize(pool.prizes));
    }

    setStats(prev => {
      const next = { 
        ...prev, 
        points: prev.points - totalPoints,
        goldenKeys: prev.goldenKeys - totalGold,
        silverKeys: prev.silverKeys - totalSilver,
        tickets: prev.tickets - totalTickets,
        tickets2027: prev.tickets2027 - totalTickets2027
      };
      const newInventory = [...next.inventory];

      currentResults.forEach(prize => {
        if (prize.points) next.points += prize.points;
        if (prize.money) {
          next.balance += prize.money;
          next.totalEarnings += prize.money;
        }

        if (prize.items) {
          if (prize.items.includes('Golden Key')) {
            next.goldenKeys += 1;
            confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b'] });
          }
          if (prize.items.includes('Ticket 2026')) {
            next.tickets += 1;
            confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 }, colors: ['#22d3ee', '#0891b2'] });
          }
          if (prize.items.includes('Super Ticket 2027')) {
            next.tickets2027 += 1;
            confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, colors: ['#a855f7', '#fb7185'] });
          }
          newInventory.push(...prize.items);
        } else if (!prize.points && prize.id !== 'points_var') {
          newInventory.push(prize.name);
          if (prize.rarity === 'legendary' || prize.rarity === 'epic' || prize.rarity === 'rare') {
            confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
          }
        }
      });

      next.inventory = newInventory;
      return next;
    });

    return currentResults;
  }, [stats.points, stats.goldenKeys, stats.silverKeys, stats.tickets, rollPrize]);

  const purchaseItem = useCallback((costPoints: number, resultType: 'goldenKeys' | 'silverKeys' | 'tickets') => {
    if (stats.points < costPoints) {
      alert('Хангалттай оноо байхгүй байна.');
      return false;
    }

    if (resultType === 'tickets' && stats.soldTicketsCount >= 1000) {
      alert('Оноогоор худалдаж авах Тасалбарын хязгаар (1,000 ширхэг) дууссан байна. Та Prize Pool-с унагааж авах боломжтой.');
      return false;
    }

    setStats(prev => ({
      ...prev,
      points: prev.points - costPoints,
      [resultType]: prev[resultType] + 1,
      soldTicketsCount: resultType === 'tickets' ? prev.soldTicketsCount + 1 : prev.soldTicketsCount
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
      // If selling for balance, also count towards total earnings? Usually yes for "Total Cash"
      totalEarnings: rewardType === 'balance' ? prev.totalEarnings + rewardAmount : prev.totalEarnings
    }));
    
    alert(`1 ${type === 'tickets' ? 'Тасалбар' : type} амжилттай зарагдлаа!`);
    return true;
  }, [stats]);

  return { stats, openPool, addCustomPool, earnSilverKeys, earnGoldenKeys, purchaseItem, sellItem };
}
