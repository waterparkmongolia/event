import React from 'react';
import { Package, Inbox, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ItemsViewProps {
  inventory: string[];
  points: number;
}

export function ItemsView({ inventory, points }: ItemsViewProps) {
  // Group inventory items
  const groupedInventory = inventory.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inventoryList = Object.entries(groupedInventory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-4xl font-light text-white">Your <span className="font-bold">Collection</span></h1>
          <p className="text-slate-500 text-[10px] sm:text-sm font-medium">History of your wins and inventory.</p>
        </div>
        <div className="bg-[#161618] border border-white/5 rounded-2xl px-6 py-3 shrink-0">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-1">Total Points</p>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xl sm:text-2xl font-black text-white italic">{points.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {inventoryList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-24 px-8 bg-[#111113] rounded-3xl border border-dashed border-white/10">
          <Inbox size={24} className="sm:size-12 text-slate-800 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Empty inventory</p>
          <p className="text-[9px] text-slate-700 mt-1 font-medium italic">Win items from prize pools.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
          {inventoryList.map(([item, count], idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#161618] border border-white/5 p-3 sm:p-6 rounded-2xl flex flex-col items-center gap-3 sm:gap-6 text-center group font-sans"
            >
              <div className={cn(
                "w-12 h-12 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center transition-all relative",
                item.toLowerCase().includes('key') ? "bg-amber-500 text-black shadow-lg" : "bg-white/5 text-slate-500"
              )}>
                {item.toLowerCase().includes('key') ? <Star size={20} className="fill-current sm:size-10" /> : <Package size={20} className="sm:size-10" />}
                
                {count > 1 && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-black w-6 h-6 rounded-full border-2 border-[#161618] flex items-center justify-center">
                    {count}x
                  </div>
                )}
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  {item.toLowerCase().includes('key') ? 'Epic' : 'Reward'}
                </span>
                <p className="text-[11px] sm:text-sm font-bold text-white uppercase italic truncate w-full px-1">{item}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
