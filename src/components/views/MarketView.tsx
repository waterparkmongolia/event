import React from 'react';
import { ShoppingBag, Key as KeyIcon, Ticket, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface MarketViewProps {
  points: number;
  ticketsCount: number;
  soldTicketsCount: number;
  onPurchase: (cost: number, type: 'goldenKeys' | 'silverKeys' | 'tickets') => void;
  onSell: (type: 'tickets', reward: number, rewardType: 'points' | 'balance') => void;
}

export function MarketView({ points, ticketsCount, soldTicketsCount, onPurchase, onSell }: MarketViewProps) {
  const items = [
    {
      id: 'ticket',
      name: 'Тасалбар 2026',
      description: 'Зөвхөн эхний 1,000 хүн оноогоор авах боломжтой (Бусад нь Pool-с унагааж авна)',
      cost: 100000,
      type: 'tickets' as const,
      icon: <Ticket className="text-cyan-400" size={32} />,
      color: 'from-cyan-500/20 to-blue-500/10',
      badge: 'Limited',
      limit: 1000,
      soldCount: soldTicketsCount
    },
    {
      id: 'gold_key',
      name: 'Алтан Түлхүүр',
      description: 'Super Pool-с шагнал авахад хэрэгтэй (1,000,000₮ эсвэл 10M оноо)',
      cost: 10000000,
      type: 'goldenKeys' as const,
      icon: <KeyIcon className="text-amber-500" size={32} />,
      color: 'from-amber-600/20 to-amber-400/10',
      badge: 'Rare'
    },
    {
      id: 'silver_key',
      name: 'Мөнгөн Түлхүүр',
      description: 'Starter Pool нээхэд ашиглана (1,000₮ эсвэл 10K оноо)',
      cost: 10000,
      type: 'silverKeys' as const,
      icon: <KeyIcon className="text-slate-400" size={32} />,
      color: 'from-slate-500/20 to-slate-400/10'
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-4xl font-light text-white">Item <span className="font-bold">Market</span></h1>
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Exchange your points for entry keys and tickets.</p>
        </div>
        <div className="bg-[#161618] border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-4">
            <TrendingUp size={20} className="text-emerald-500" />
            <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Market Balance</p>
                <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black text-white italic">{points.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-amber-500">PTS</span>
                </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#161618] border border-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
              item.color
            )} />

            {item.badge && (
                <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                        {item.badge}
                    </span>
                </div>
            )}

            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center mb-4 sm:mb-6 shadow-2xl relative">
              {item.icon}
              <div className="absolute inset-0 blur-2xl opacity-20 bg-white" />
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white uppercase italic tracking-tighter mb-1 sm:mb-2">
              {item.name}
            </h3>
            <p className="text-[10px] sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 max-w-[200px]">
              {item.description}
            </p>

            {item.limit && (
              <div className="w-full mb-6 sm:mb-8">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">
                  <span>Sold Out Progress</span>
                  <span className={cn(
                    item.soldCount! >= item.limit ? "text-red-500" : "text-cyan-400"
                  )}>
                    {item.soldCount}/{item.limit}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.soldCount! / item.limit) * 100, 100)}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      item.soldCount! >= item.limit ? "bg-red-500" : "bg-cyan-400"
                    )}
                  />
                </div>
              </div>
            )}

            <div className="mt-auto w-full space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-500">
                <Sparkles size={14} className="sm:size-16" />
                <span className="text-base sm:text-xl font-black italic">{item.cost.toLocaleString()}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">Points</span>
              </div>

              <button
                onClick={() => onPurchase(item.cost, item.type)}
                disabled={points < item.cost || (item.limit !== undefined && item.soldCount! >= item.limit)}
                className={cn(
                  "w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all",
                  points >= item.cost && (item.limit === undefined || item.soldCount! < item.limit)
                    ? "bg-white text-black hover:bg-amber-400 hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/5"
                    : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                )}
              >
                {item.limit !== undefined && item.soldCount! >= item.limit 
                  ? 'Sold Out' 
                  : points >= item.cost ? 'Exchange' : 'Insufficient Points'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Sell Depot Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase italic">Sell Depot</h2>
            <p className="text-xs text-slate-500">Sell your earned items back to the market for cash or points.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#161618] border border-white/5 rounded-[2rem] p-6 flex items-center gap-6 group hover:border-cyan-500/20 transition-all"
          >
            <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Ticket size={40} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-lg font-black text-white uppercase italic">Sell Ticket 2026</h4>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">Owned: {ticketsCount}</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-4 font-medium uppercase tracking-widest">Market Value: <span className="text-emerald-400">50,000₮</span> or <span className="text-amber-500">5M PTS</span></p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onSell('tickets', 50000, 'balance')}
                  disabled={ticketsCount <= 0}
                  className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-white/5 disabled:text-white/20 border border-emerald-500/20 disabled:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all"
                >
                  Sell for Cash
                </button>
                <button 
                  onClick={() => onSell('tickets', 5000000, 'points')}
                  disabled={ticketsCount <= 0}
                  className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-white/5 disabled:text-white/20 border border-amber-500/20 disabled:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 transition-all"
                >
                   Sell for Points
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-black/20 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <ShoppingBag size={24} />
            </div>
            <div>
                <h4 className="text-white font-bold uppercase italic">Special Offer</h4>
                <p className="text-xs text-slate-500">Earn more points by completing daily tasks and challenges.</p>
            </div>
        </div>
        <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
            View Tasks
        </button>
      </div>
    </div>
  );
}
