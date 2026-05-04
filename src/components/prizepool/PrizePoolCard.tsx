import React from 'react';
import { PrizePool } from '../../types';
import { cn } from '../../lib/utils';

interface PrizePoolCardProps {
  pool: PrizePool;
  onClick: () => void;
  isLocked?: boolean;
}

export const PrizePoolCard: React.FC<PrizePoolCardProps> = ({ pool, onClick, isLocked }) => {
  const isSuper = pool.type === 'super';
  const isStarter = pool.type === 'starter';
  const prizes = pool.prizes;

  const costText = pool.cost.tickets2027
    ? `${pool.cost.tickets2027} Super Ticket 2027`
    : pool.cost.tickets
      ? `${pool.cost.tickets} Тасалбар`
      : pool.cost.goldenKeys
        ? `${pool.cost.goldenKeys} Алтан Түлхүүр`
        : pool.cost.silverKeys
          ? `${pool.cost.silverKeys} Мөнгөн Түлхүүр`
          : `${pool.cost.points} Оноо`;

  return (
    <section
      onClick={isLocked ? undefined : onClick}
      className={cn(
        "transition-all duration-300 border rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden relative group",
        isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer",
        isSuper 
          ? "bg-brand-card-super border-amber-500/30 accent-shadow" 
          : "bg-brand-card-reg border-white/5 hover:border-white/20"
      )}
    >
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
          <div className="bg-amber-500 text-black p-3 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <span className="text-white font-black italic uppercase tracking-widest text-xs">Locked</span>
          <p className="text-[10px] text-amber-400 font-bold mt-1 px-4 text-center">Тасалбар шаардлагатай</p>
        </div>
      )}

      {/* Pool Image Header */}
      {pool.image && (
        <div className="w-full h-32 sm:h-48 relative overflow-hidden">
          <img 
            src={pool.image} 
            alt={pool.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60",
            isSuper ? "from-brand-card-super" : "from-brand-card-reg"
          )} />
        </div>
      )}

      <div className="p-4 sm:p-6 flex flex-col flex-1 relative">
        <div className={cn(
          "absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 blur-3xl rounded-full transition-opacity opacity-20 group-hover:opacity-40",
          isSuper ? "bg-amber-500/20" : "bg-slate-500/10"
        )} />
        
        <div className="flex justify-between items-start mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">
            {pool.name}
          </h2>
          <div className={cn(
            "px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-[9px] sm:text-xs font-black italic tracking-tight",
            isSuper ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300"
          )}>
            {isSuper ? 'RARE' : 'NORMAL'}
          </div>
        </div>

        <p className="text-[10px] sm:text-xs text-white/40 mb-4 line-clamp-2">
          {pool.description}
        </p>

      <button className={cn(
        "mt-6 w-full py-4 font-black uppercase rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
        isSuper 
          ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-amber-500/20" 
          : "bg-white text-black hover:bg-slate-200"
      )}>
        Open with {costText}
      </button>
      </div>
    </section>
  );
}
