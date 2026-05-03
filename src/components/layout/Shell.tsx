import React, { useState } from 'react';
import {
  Menu, Package, Calendar, CheckSquare, Key as KeyIcon, Ticket,
  ShoppingBag, LogOut, X, Wallet, Trophy, User, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

const NAV_ITEMS = [
  { id: 'events',  label: 'Events',  icon: Calendar },
  { id: 'market',  label: 'Market',  icon: ShoppingBag },
  { id: 'tasks',   label: 'Tasks',   icon: CheckSquare },
  { id: 'items',   label: 'Items',   icon: Package },
];

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
  onLogout,
}: ShellProps) {
  const [leftOpen, setLeftOpen]   = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const closeAll = () => { setLeftOpen(false); setRightOpen(false); };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    closeAll();
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-slate-200 overflow-hidden font-sans">

      {/* ── Top Navigation ─────────────────────────────── */}
      <header className="h-12 sm:h-14 flex items-center justify-between px-3 sm:px-5 border-b border-white/10 bg-brand-nav z-30 shrink-0">

        {/* LEFT: app-menu toggle + brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setLeftOpen(v => !v); setRightOpen(false); }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase">
            Event<span className="text-amber-500">Hub</span>
          </span>
        </div>

        {/* CENTER: wallet (hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5">
          <Wallet size={13} className="text-amber-500 mr-1" />
          <span className="text-xs font-black text-white">{userBalance.toLocaleString()}₮</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-xs font-black text-emerald-400">${userDollarBalance.toLocaleString()}</span>
        </div>

        {/* RIGHT: profile avatar (opens user menu) */}
        <button
          type="button"
          onClick={() => { setRightOpen(v => !v); setLeftOpen(false); }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 border-2 border-white/10 flex items-center justify-center hover:border-amber-500/60 transition-all shrink-0"
        >
          <span className="text-black font-black text-sm uppercase">
            {username ? username[0] : '?'}
          </span>
        </button>
      </header>

      {/* ── Stats Sub-header ───────────────────────────── */}
      <div className="h-10 border-b border-white/5 bg-[#161618] flex items-center justify-center gap-3 sm:gap-5 px-4 z-20 shrink-0 overflow-x-auto">
        <StatBadge icon={<KeyIcon size={13} className="text-amber-500" />} value={userKeys}    label="Gold"   />
        <StatBadge icon={<KeyIcon size={13} className="text-slate-400" />} value={silverKeys}  label="Silver" />
        <StatBadge icon={<Ticket  size={12} className="text-cyan-400"  />} value={tickets}     label="2026"   />
        {tickets2027 > 0 && (
          <StatBadge
            icon={<Ticket size={12} className="text-purple-400" />}
            value={tickets2027}
            label="2027"
            purple
          />
        )}
      </div>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="flex-1 overflow-y-auto relative pb-16">{children}</main>

      {/* ── Bottom Navigation ──────────────────────────── */}
      <footer className="h-14 sm:h-16 border-t border-white/10 bg-brand-nav flex items-center justify-center gap-6 sm:gap-16 px-4 z-40">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <NavButton
            key={id}
            active={activeTab === id}
            onClick={() => handleTabChange(id)}
            icon={<Icon size={18} className="sm:w-5 sm:h-5" />}
            label={label}
          />
        ))}
      </footer>

      {/* ── Backdrop ───────────────────────────────────── */}
      <AnimatePresence>
        {(leftOpen || rightOpen) && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* ── Left Sidebar (App Menu) ────────────────────── */}
      <AnimatePresence>
        {leftOpen && (
          <motion.aside
            key="left-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-72 bg-[#111113] border-r border-white/10 z-50 flex flex-col"
          >
            {/* Sidebar header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
              <span className="text-lg font-black tracking-tighter text-white uppercase">
                Event<span className="text-amber-500">Hub</span>
              </span>
              <button
                type="button"
                title="Хаах"
                onClick={() => setLeftOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 px-3 mb-3">Цэс</p>
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabChange(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all',
                    activeTab === id
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={18} />
                  <span className="uppercase tracking-wide">{label}</span>
                  {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </nav>

            {/* Bottom stats */}
            <div className="p-4 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <KeyIcon size={14} className="text-amber-500" />
                  <span className="text-xs font-bold">Алтан Түлхүүр</span>
                </div>
                <span className="text-sm font-black text-amber-500">{userKeys}</span>
              </div>
              <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <KeyIcon size={14} className="text-slate-400" />
                  <span className="text-xs font-bold">Мөнгөн Түлхүүр</span>
                </div>
                <span className="text-sm font-black text-slate-300">{silverKeys}</span>
              </div>
              <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Ticket size={13} className="text-cyan-400" />
                  <span className="text-xs font-bold">Тасалбар 2026</span>
                </div>
                <span className="text-sm font-black text-cyan-400">{tickets}</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Right Sidebar (User Menu) ──────────────────── */}
      <AnimatePresence>
        {rightOpen && (
          <motion.aside
            key="right-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-72 bg-[#111113] border-l border-white/10 z-50 flex flex-col"
          >
            {/* Sidebar header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
              <span className="text-sm font-black uppercase tracking-widest text-white/60">Хэрэглэгч</span>
              <button
                type="button"
                title="Хаах"
                onClick={() => setRightOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile card */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <span className="text-black font-black text-xl uppercase">
                    {username ? username[0] : '?'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-black text-base uppercase tracking-wide">{username}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Гишүүн</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-2 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1 mb-3">Тоо баримт</p>

              <StatRow icon={<Wallet size={15} className="text-amber-500" />}    label="Үлдэгдэл"      value={`${userBalance.toLocaleString()}₮`}       />
              <StatRow icon={<Wallet size={15} className="text-emerald-400" />}  label="Dollar"         value={`$${userDollarBalance.toLocaleString()}`}  />
              <StatRow icon={<Trophy size={15} className="text-cyan-400" />}     label="Нийт орлого"   value={`${totalEarnings.toLocaleString()}₮`}       />
              <StatRow icon={<User   size={15} className="text-amber-500" />}    label="Оноо"           value={userPoints.toLocaleString()}                color="text-amber-500" />
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-black uppercase tracking-widest transition-all"
              >
                <LogOut size={16} />
                Гарах
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ── Small helpers ─────────────────────────────────────── */

function StatBadge({ icon, value, label, purple }: {
  icon: React.ReactNode; value: number; label: string; purple?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 px-3 py-1 rounded-full border shrink-0',
      purple ? 'bg-purple-500/10 border-purple-500/20' : 'bg-black/20 border-white/5'
    )}>
      {icon}
      <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
        {value} <span className={cn('font-bold ml-0.5 hidden xs:inline', purple ? 'text-purple-400' : 'text-white/40')}>{label}</span>
      </p>
    </div>
  );
}

function StatRow({ icon, label, value, color = 'text-white' }: {
  icon: React.ReactNode; label: string; value: string; color?: string;
}) {
  return (
    <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className={cn('text-sm font-black', color)}>{value}</span>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 transition-all duration-300 relative',
        active ? 'text-amber-500' : 'text-slate-500 hover:text-white'
      )}
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute -top-3 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />
      )}
      <div className="transition-transform duration-300">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
