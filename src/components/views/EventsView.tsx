import React, { useState } from 'react';
import { Ticket, Key as KeyIcon } from 'lucide-react';
import { PrizePoolCard } from '../prizepool/PrizePoolCard';
import { PoolModal } from '../prizepool/PoolModal';
import { Prize, PrizePool, DEFAULT_STARTER_POOL, DEFAULT_SUPER_POOL, DEFAULT_SUPER_POOL_2027 } from '../../types';

interface EventsViewProps {
  stats: { 
    points: number; 
    balance: number;
    goldenKeys: number; 
    silverKeys: number;
    tickets: number;
    tickets2027: number;
    customPools?: PrizePool[];
  };
  onOpen: (pool: PrizePool, count?: number) => Prize[] | null;
}

export function EventsView({ stats, onOpen }: EventsViewProps) {
  const [activePool, setActivePool] = useState<PrizePool | null>(null);

  const pools: PrizePool[] = [
    DEFAULT_STARTER_POOL,
    DEFAULT_SUPER_POOL,
    DEFAULT_SUPER_POOL_2027,
    ...(stats.customPools || [])
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl sm:text-4xl font-light text-white">Live <span className="font-bold">Events</span></h1>
          <p className="text-slate-500 text-[10px] sm:text-sm mt-1">Select a prize pool to participate.</p>
        </div>
        <div className="hidden sm:flex flex-wrap justify-end gap-2 max-w-xl">
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{stats.balance.toLocaleString()}₮</span>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Ticket size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{stats.tickets} TKI (2026)</span>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Ticket size={12} className="text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{stats.tickets2027} TKI (2027)</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{stats.goldenKeys} GK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
        {pools.map((pool: PrizePool) => {
          const currentYear = new Date().getFullYear();
          const isYearLocked = pool.id === 'super_2027' && currentYear < 2027;
          const isTicketLocked = (pool.id === 'super' && stats.tickets === 0) || 
                                (pool.id === 'super_2027' && stats.tickets2027 === 0);
          
          const isLocked = isYearLocked || isTicketLocked;
          
          return (
            <div key={pool.id} className="relative">
              <PrizePoolCard 
                pool={pool}
                isLocked={isLocked}
                onClick={() => {
                  if (pool.id === 'super_2027' && isYearLocked) {
                    alert('Энэ Prize Pool зөвхөн 2027 онд нээгдэнэ!');
                    return;
                  }
                  setActivePool(pool);
                }}
              />
              {isLocked && (
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                  {isYearLocked && (
                    <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">SOON IN 2027</span>
                    </div>
                  )}
                  {isTicketLocked && !isYearLocked && (
                    <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Тасалбар хэрэгтэй</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 uppercase tracking-tighter">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 w-full">
          <div className="space-y-3">
            <div className="text-3xl font-black text-slate-800">01</div>
            <h4 className="font-bold text-slate-200">Earn Keys</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Daily tasks and invites give you Golden Keys to participate in premium draws.</p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-black text-amber-600/40">02</div>
            <h4 className="font-bold text-slate-200">Unlock Pools</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Super Reward Pool 2026-д ороход Ticket 2026 шаардлагатай. Харин Super Prize Pool 2027 тасалбарыг (Super Ticket 2027) зөвхөн 2026 оны санг нээж унагаах боломжтой.</p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-black text-white/20">03</div>
            <h4 className="font-bold text-slate-200">Win Big</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Collect as many points and physical prizes as you can. Good luck!</p>
          </div>
        </div>
      </div>

      <PoolModal 
        pool={activePool}
        isOpen={!!activePool}
        onClose={() => setActivePool(null)}
        onOpen={(count) => activePool ? onOpen(activePool, count) : null}
        userStats={stats}
      />
    </div>
  );
}
