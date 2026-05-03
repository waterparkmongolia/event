import React from 'react';
import { Menu, Package, Calendar, CheckSquare, Key as KeyIcon, Ticket, ShoppingBag, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userPoints: number;
  userBalance: number;
  userDollarBalance: number;
  totalEarnings: number;
  totalDollarEarnings: number;
  userKeys: number;
  silverKeys: number;
  tickets: number;
  tickets2027: number;
  username?: string;
  onLogout?: () => void;
}

export function Shell({
  children,
  activeTab,
  onTabChange,
  userPoints,
  userBalance,
  userDollarBalance,
  totalEarnings,
  totalDollarEarnings,
  userKeys,
  silverKeys,
  tickets,
  tickets2027,
  username,
  onLogout
}: ShellProps) {
  return (
    <div className="flex flex-col h-screen bg-brand-bg text-slate-200 overflow-hidden font-sans">
      {/* Top Navigation */}
      <header className="h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-brand-nav z-30 shrink-0">
        <div className="flex items-center gap-3 sm:gap-6">
          <button className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400">
            <Menu size={20} className="sm:w-6 sm:h-6" />
          </button>
          <span className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase">
            Prize<span className="text-amber-500">Box</span>
          </span>
          <div className="hidden md:block h-6 w-px bg-white/10 mx-2"></div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-4 text-right overflow-hidden">
            <div className="flex flex-col items-end">
              <p className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-white/40 leading-none">Wallet</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <p className="text-[10px] sm:text-sm font-black text-white leading-tight whitespace-nowrap">{userBalance.toLocaleString()}₮</p>
                <div className="w-[1px] h-3 bg-white/10" />
                <p className="text-[10px] sm:text-sm font-black text-emerald-400 leading-tight whitespace-nowrap">${userDollarBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-col items-end border-l border-white/10 pl-2 sm:pl-4">
              <p className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-white/40 leading-none">Total Cash</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <p className="text-[10px] sm:text-sm font-black text-cyan-400 leading-tight whitespace-nowrap">{totalEarnings.toLocaleString()}₮</p>
                <div className="w-[1px] h-3 bg-white/10" />
                <p className="text-[10px] sm:text-sm font-black text-emerald-400/80 leading-tight whitespace-nowrap">${totalDollarEarnings.toLocaleString()}</p>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end border-l border-white/10 pl-3 sm:pl-4">
              <p className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-white/40 leading-none">Points</p>
              <p className="text-xs sm:text-sm font-black text-amber-500 leading-tight whitespace-nowrap">{userPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {username && (
              <span className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-widest">{username}</span>
            )}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 border border-white/10 flex items-center justify-center shrink-0">
              {username && (
                <span className="text-black font-black text-xs uppercase">{username[0]}</span>
              )}
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Гарах"
                className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-red-400"
              >
                <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stats Sub-header */}
      <div className="h-10 border-b border-white/5 bg-[#161618] flex items-center justify-center gap-3 sm:gap-6 px-4 z-20 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5 shrink-0">
          <KeyIcon size={14} className="text-amber-500" />
          <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
            {userKeys} <span className="text-white/40 font-bold ml-1 hidden xs:inline">Gold</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5 shrink-0">
          <KeyIcon size={14} className="text-slate-400" />
          <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
            {silverKeys} <span className="text-white/40 font-bold ml-1 hidden xs:inline">Silver</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5 shrink-0">
          <Ticket size={12} className="text-cyan-400" />
          <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
            {tickets} <span className="text-white/40 font-bold ml-1 hidden xs:inline">2026</span>
          </p>
        </div>
        {tickets2027 > 0 && (
          <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shrink-0">
            <Ticket size={12} className="text-purple-400" />
            <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
              {tickets2027} <span className="text-purple-400 font-bold ml-1 hidden xs:inline">2027</span>
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <footer className="h-14 sm:h-16 border-t border-white/10 bg-brand-nav flex items-center justify-center gap-6 sm:gap-16 px-4 z-40">
        <NavButton 
          active={activeTab === 'market'} 
          onClick={() => onTabChange('market')} 
          icon={<ShoppingBag size={18} className="sm:w-5 sm:h-5" />} 
          label="Market" 
        />
        <NavButton 
          active={activeTab === 'tasks'} 
          onClick={() => onTabChange('tasks')} 
          icon={<CheckSquare size={18} className="sm:w-5 sm:h-5" />} 
          label="Tasks" 
        />
        <NavButton 
          active={activeTab === 'events'} 
          onClick={() => onTabChange('events')} 
          icon={<Calendar size={18} className="sm:w-5 sm:h-5" />} 
          label="Events" 
        />
        <NavButton 
          active={activeTab === 'items'} 
          onClick={() => onTabChange('items')} 
          icon={<Package size={18} className="sm:w-5 sm:h-5" />} 
          label="Items" 
        />
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 relative",
        active ? "text-amber-500" : "text-slate-500 hover:text-white"
      )}
    >
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="absolute -top-3 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />
      )}
      <div className="transition-transform duration-300">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
