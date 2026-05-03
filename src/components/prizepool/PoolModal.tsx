import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key as KeyIcon, Package, Sparkles, Crown, Ticket, Archive, Diamond, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Prize, PrizePool } from '../../types';

interface PrizeFlipCardProps {
  prize: Prize;
  index: number;
}

const PrizeFlipCard: React.FC<PrizeFlipCardProps> = ({ prize, index }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const isLegendary = prize.rarity === 'legendary';
  const isEpic = prize.rarity === 'epic';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 600 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="relative w-full aspect-square [perspective:1000px]">
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative [transform-style:preserve-3d]"
      >
        {/* Card Back (Hidden Side Initially) */}
        <div 
          className="absolute inset-0 bg-[#1a1a1a] border-2 border-white/10 rounded-2xl sm:rounded-[2rem] flex flex-col items-center justify-center shadow-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
           <motion.div
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-12 h-12 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center"
           >
              <Sparkles size={24} className="sm:size-32 text-white/20" />
           </motion.div>
           <div className="absolute top-2 left-2 right-2 bottom-2 border border-white/5 rounded-xl sm:rounded-[1.5rem]" />
        </div>

        {/* Card Front (Actual Prize) */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl sm:rounded-[2rem] border-2 p-1 flex items-center justify-center overflow-hidden transition-all duration-500 shadow-2xl",
            isLegendary ? "bg-gradient-to-br from-[#B9F2FF] via-white to-[#00CED1] border-cyan-100/50 shadow-[0_10px_50px_rgba(0,206,209,0.4)]" :
            isEpic ? "bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#9E7E1D] border-amber-300/50 shadow-[0_8px_40px_rgba(255,215,0,0.4)]" :
            prize.rarity === 'rare' ? "bg-gradient-to-br from-[#C0C0C0] via-[#E8E8E8] to-[#808080] border-slate-300/50 shadow-[0_6px_30px_rgba(255,255,255,0.2)]" :
            "bg-gradient-to-b from-slate-800 to-slate-950 border-white/10"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Metallic Texture Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
          
          {/* Rarity Effects */}
          {isLegendary && (
            <>
              <motion.div 
                 animate={{ opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.8),transparent_70%)] opacity-50" 
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.8, 0],
                    rotate: [0, 180, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.4 
                  }}
                  className="absolute"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`
                  }}
                >
                  <Sparkles size={12} className="text-white" />
                </motion.div>
              ))}
            </>
          )}

          {/* Premium Metallic Shine Sweep */}
          {isFlipped && (isLegendary || isEpic || prize.rarity === 'rare') && (
            <motion.div
              initial={{ x: '-150%', skewX: -25 }}
              animate={{ x: '150%' }}
              transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -z-0"
            />
          )}

          <div className="relative z-10 flex flex-col items-center justify-center p-2 w-full h-full">
            {/* If it has items or is a key/ticket, show icon. Otherwise just show name centered */}
            {(prize.items || prize.name.includes('Key') || prize.name.includes('Ticket') || prize.id === 'apt' || prize.id === 'prius' || prize.id === 'apt_2027' || prize.id === 'land_300' || prize.id === 'mac_pro_m4' || prize.id === 'iphone_16_pro') ? (
              <>
                <div className="flex flex-col items-center justify-center">
                  {prize.id === 'apt' ? (
                    <Archive size={48} className={cn(
                      "sm:size-32 mb-2",
                      isLegendary ? "text-cyan-900" : "text-white shadow-lg"
                    )} />
                  ) : prize.id === 'prius' ? (
                    <Archive size={48} className={cn(
                      "sm:size-32 mb-2",
                      isLegendary ? "text-cyan-900" : "text-white shadow-lg"
                    )} />
                  ) : prize.name.includes('Key') ? (
                    <KeyIcon size={32} className={cn(
                      "sm:size-24 mb-1",
                      isLegendary ? "text-cyan-900" : isEpic ? "text-[#4d3d00]" : prize.rarity === 'rare' ? "text-slate-800" : "text-white shadow-lg"
                    )} />
                  ) : (prize.name.includes('Ticket') || prize.name.includes('Тасалбар')) ? (
                    <Ticket size={32} className={cn(
                      "sm:size-24 mb-1",
                      isLegendary ? "text-cyan-900" : isEpic ? "text-[#4d3d00]" : prize.rarity === 'rare' ? "text-slate-800" : "text-cyan-200 shadow-lg"
                    )} />
                  ) : (
                    <Package size={32} className={cn(
                      "sm:size-24 mb-1",
                      isLegendary ? "text-cyan-900" : isEpic ? "text-[#4d3d00]" : prize.rarity === 'rare' ? "text-slate-800" : "text-white shadow-lg"
                    )} />
                  )}
                </div>
                <span className={cn(
                  "text-[8px] sm:text-[12px] font-black uppercase tracking-tighter text-center line-clamp-1 max-w-[90%] block mt-1",
                  isLegendary ? "text-cyan-950/80" : isEpic ? "text-[#4d3d00]/80" : prize.rarity === 'rare' ? "text-slate-900/80" : "text-white/80"
                )}>
                  {prize.name}
                </span>
              </>
            ) : (
              <div className={cn(
                "font-black text-2xl sm:text-5xl italic tracking-tighter leading-none text-center px-2",
                isLegendary ? "text-cyan-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]" : 
                isEpic ? "text-[#4d3d00] drop-shadow-[0_2px_2px_rgba(255,215,0,0.5)]" : 
                prize.rarity === 'rare' ? "text-slate-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]" : 
                "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
              )}>
                {prize.name}
              </div>
            )}
          </div>

          {/* Rarity Tag */}
          {prize.rarity !== 'common' && prize.rarity !== 'uncommon' && (
            <div className={cn(
              "absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 px-1.5 sm:px-3 py-0.5 rounded-full backdrop-blur-sm border",
              isLegendary ? "bg-cyan-900/40 border-cyan-100" : isEpic ? "bg-amber-900/40 border-amber-200" : "bg-black/40 border-white/5"
            )}>
              <span className="text-[5px] sm:text-[10px] font-black uppercase tracking-widest text-white">
                {prize.rarity}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface PoolModalProps {
  pool: PrizePool | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (count: number) => Prize[] | null;
  userStats: { points: number; balance: number; goldenKeys: number; silverKeys: number; tickets: number; tickets2027: number };
}

export function PoolModal({ pool, isOpen, onClose, onOpen, userStats }: PoolModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [wonPrizes, setWonPrizes] = useState<Prize[] | null>(null);
  const [showOdds, setShowOdds] = useState(false);

  if (!pool) return null;

  const handleOpen = (count: number) => {
    setIsOpening(true);
    setWonPrizes(null);
    
    // Simulate delay for dramatic effect
    setTimeout(() => {
      const results = onOpen(count);
      if (results && results.length > 0) {
        setWonPrizes(results);
      }
      setIsOpening(false);
    }, 1500);
  };

  const isSuper = pool.type === 'super';
  const prizes = pool.prizes;

  const canAfford = (count: number) => {
    const totalPoints = (pool.cost.points || 0) * count;
    const totalGold = (pool.cost.goldenKeys || 0) * count;
    const totalSilver = (pool.cost.silverKeys || 0) * count;
    const totalTickets = (pool.cost.tickets || 0) * count;
    const totalTickets2027 = (pool.cost.tickets2027 || 0) * count;

    // Super pool requires at least 1 ticket for access (entry requirement)
    if (pool.id === 'super' && userStats.tickets === 0) return false;
    if (pool.id === 'super_2027') {
      const currentYear = new Date().getFullYear();
      if (currentYear < 2027 || userStats.tickets2027 === 0) return false;
    }

    return (
      userStats.points >= totalPoints &&
      userStats.goldenKeys >= totalGold &&
      userStats.silverKeys >= totalSilver &&
      userStats.tickets >= totalTickets &&
      userStats.tickets2027 >= totalTickets2027
    );
  };

  const costText = pool.cost.tickets2027
    ? `${pool.cost.tickets2027} Ticket 2027`
    : pool.cost.tickets
      ? `${pool.cost.tickets} Тасалбар`
      : pool.cost.goldenKeys 
      ? pool.cost.silverKeys 
        ? `${pool.cost.goldenKeys} Алтан + ${pool.cost.silverKeys} Мөнгөн`
        : `${pool.cost.goldenKeys} Алтан Түлхүүр`
    : pool.cost.silverKeys
      ? `${pool.cost.silverKeys} Мөнгөн Түлхүүр`
      : `${pool.cost.points} Points`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-brand-bg font-sans"
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-white/10 bg-brand-nav">
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">
              {pool.name}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowOdds(!showOdds)} 
                className={cn(
                  "p-2 rounded-full transition-all",
                  showOdds ? "bg-cyan-500 text-black" : "hover:bg-white/5 text-slate-400"
                )}
                title="Show Probabilities"
              >
                <Info size={20} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Stats Sub-header */}
          <div className="h-10 border-b border-white/5 bg-[#161618] flex items-center justify-center gap-3 sm:gap-6 px-4 z-20 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full border border-white/5 shrink-0">
              <Diamond size={12} className="text-cyan-400" />
              <p className="text-[10px] sm:text-xs font-black text-white leading-none tracking-tighter">
                {userStats.balance.toLocaleString()}₮
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full border border-white/5 shrink-0">
              <KeyIcon size={12} className="text-amber-500" />
              <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
                {userStats.goldenKeys}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full border border-white/5 shrink-0">
              <KeyIcon size={12} className="text-slate-400" />
              <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
                {userStats.silverKeys}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full border border-white/5 shrink-0">
              <Ticket size={10} className="text-cyan-400" />
              <p className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-tighter">
                {userStats.tickets}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2 sm:py-8 flex flex-col items-center">
            {/* Box Visualization */}
            {!wonPrizes && (
              <div className="relative w-full h-[220px] sm:h-[450px] mb-2 sm:mb-8 flex items-center justify-center">
                {/* Outer Glow Ambient */}
                <div className={cn(
                  "absolute inset-0 blur-[80px] sm:blur-[120px] transition-all duration-1000 opacity-60",
                  isSuper ? "bg-amber-500/30" : "bg-cyan-500/20"
                )} />

                {/* The Glass Box Container */}
                <motion.div 
                  animate={isOpening ? { 
                    scale: 0.8,
                    opacity: 0.2,
                    y: -20,
                    filter: "blur(4px)"
                  } : {
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "relative z-10 w-24 h-24 sm:w-52 sm:h-52 backdrop-blur-xl bg-white/5 border-2 rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500",
                    isSuper ? "border-amber-400/30" : "border-white/20"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 -skew-y-12" />
                  
                  <AnimatePresence>
                    {!isOpening && (
                      <motion.div
                        key="internal-key"
                        exit={{ y: -150, scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "backIn" }}
                        className="relative z-10"
                      >
                        <div className="relative">
                          <KeyIcon 
                            size={48} 
                            className={cn(
                              "sm:size-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]",
                              (isSuper || pool.id === 'starter_pool') ? "text-amber-400" : "text-white"
                            )} 
                          />
                          <div className={cn(
                            "absolute inset-0 blur-2xl opacity-40",
                            (isSuper || pool.id === 'starter_pool') ? "bg-amber-400" : "bg-white"
                          )} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute top-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t-2 border-l-2 border-white/20 rounded-tl-sm" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t-2 border-r-2 border-white/20 rounded-tr-sm" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b-2 border-l-2 border-white/20 rounded-bl-sm" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b-2 border-r-2 border-white/20 rounded-br-sm" />
                </motion.div>

                {/* The Chest Visualization during Opening (Full Screen Overlay) */}
                <AnimatePresence>
                  {isOpening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center pointer-events-auto"
                    >
                      {/* Deep Ambient Background */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]" />
                      
                      {/* Background Lighting Flare */}
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "absolute w-64 h-64 rounded-full blur-[100px]",
                          isSuper ? "bg-amber-500/40" : "bg-cyan-500/40"
                        )}
                      />

                      <motion.div
                        initial={{ y: 200, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1.2 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="relative flex flex-col items-center justify-center p-12"
                      >
                        <motion.div
                          animate={{ rotate: [-1, 1, -1] }}
                          transition={{ duration: 0.2, repeat: Infinity }}
                          className="relative"
                        >
                          <Archive size={140} className={cn(
                             "sm:size-56 drop-shadow-[0_0_50px_rgba(34,211,238,0.4)]",
                             isSuper ? "text-amber-500" : "text-cyan-400"
                          )} />
                          
                          {/* Incoming Key Animation */}
                          <motion.div
                            initial={{ y: -600, opacity: 0, scale: 4 }}
                            animate={{ y: -60, opacity: 1, scale: 0.8 }}
                            transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                          >
                            <div className="relative">
                              <KeyIcon size={80} className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]" />
                              <motion.div 
                                animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
                                transition={{ delay: 1.0, duration: 0.4 }}
                                className="absolute inset-0 bg-white blur-2xl rounded-full"
                              />
                            </div>
                          </motion.div>

                          {/* Flash before reveal */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ delay: 1.2, duration: 0.4 }}
                            className="absolute inset-0 bg-white blur-[100px] rounded-full scale-[3]"
                          />
                        </motion.div>

                        {/* Centered Rolling Text */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-16 text-center"
                        >
                           <h3 className="text-2xl sm:text-5xl font-black italic uppercase text-white/50 animate-pulse tracking-[-0.05em]">
                             Rolling rewards...
                           </h3>
                           <div className="mt-4 flex justify-center gap-1">
                             {[0, 1, 2].map((i) => (
                               <motion.div
                                 key={i}
                                 animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                 transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                 className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                               />
                             ))}
                           </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Base Platform Shadow */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-black/60 blur-2xl rounded-full" />
                
                {/* Particles/Sparkles around the box */}
                {!isOpening && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -60, 0],
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 40, 0]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.4
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full lg:w-1.5 lg:h-1.5"
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${40 + Math.random() * 40}%`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Winning Section (Premium Fullscreen Reveal) */}
            <AnimatePresence>
              {wonPrizes && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-4 sm:p-10"
                >
                  {/* Deep Ambient Lighting */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_70%)]" />
                    <motion.div 
                      animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(34,211,238,0.1),transparent)]"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 w-full max-w-5xl flex flex-col items-center"
                  >
                    {/* Header: Congrats Reveal */}
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="flex flex-col items-center mb-6 sm:mb-12"
                    >
                      <div className="mb-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                         <span className="text-xs sm:text-lg font-black text-white/50 uppercase tracking-widest">
                           Миний Мөнгө - <span className="text-cyan-400">{userStats.balance.toLocaleString()}₮</span>
                         </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles size={16} className="sm:size-32 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,1)]" />
                        </motion.div>
                        <h2 className="text-3xl sm:text-7xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                          Congrats!
                        </h2>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <Sparkles size={16} className="sm:size-32 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,1)]" />
                        </motion.div>
                      </div>
                      <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[8px] sm:text-sm italic">
                        Items successfully claimed
                      </p>
                      <div className="mt-2 sm:mt-4 h-0.5 w-32 sm:w-64 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    </motion.div>

                    {/* Prize Grid */}
                    <div className={cn(
                      "grid gap-3 sm:gap-8 w-full max-w-4xl px-2 sm:px-4 auto-rows-fr",
                      wonPrizes.length === 1 ? "grid-cols-1 max-w-[150px] sm:max-w-xs" : 
                      wonPrizes.length <= 3 ? "grid-cols-3" : 
                      "grid-cols-4 sm:grid-cols-5"
                    )}>
                      {wonPrizes.map((p, i) => (
                        <PrizeFlipCard key={`${p.id}-${i}`} prize={p} index={i} />
                      ))}
                    </div>

                    {/* CTAs */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-10 sm:mt-24 w-full sm:w-auto px-6"
                    >
                      <button 
                        onClick={() => setWonPrizes(null)}
                        className="w-full sm:w-auto px-12 sm:px-20 py-3 sm:py-5 bg-white text-black rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-sm hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                      >
                        Confirm
                      </button>

                      <button 
                        onClick={() => {
                          const count = wonPrizes.length;
                          setWonPrizes(null);
                          handleOpen(count);
                        }}
                        className="w-full sm:w-auto px-12 sm:px-20 py-3 sm:py-5 bg-black/40 border border-white/10 hover:bg-white/5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-sm transition-all flex items-center justify-center gap-2 group"
                      >
                        Draw Again
                        <Sparkles size={14} className="text-amber-500 group-hover:animate-pulse" />
                      </button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Logic */}
            <AnimatePresence mode="wait">
              {wonPrizes ? null : isOpening ? null : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-8 flex flex-col items-center"
                >
                  <p className="text-slate-500 text-[10px] sm:text-sm mb-6 max-w-xs font-medium leading-relaxed">
                    {pool.description}
                  </p>
                  
                  <div className="flex flex-row gap-2 w-full">
                    <button 
                      onClick={() => handleOpen(1)}
                      disabled={!canAfford(1)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl font-black text-xs sm:text-lg tracking-widest transition-all transform active:scale-95 disabled:grayscale disabled:opacity-50",
                        isSuper 
                          ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black uppercase" 
                          : "bg-white text-black uppercase italic"
                      )}
                    >
                      1X
                    </button>
                    <button 
                      onClick={() => handleOpen(3)}
                      disabled={!canAfford(3)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl font-black text-xs sm:text-lg tracking-widest transition-all transform active:scale-95 disabled:grayscale disabled:opacity-50",
                        isSuper 
                          ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black uppercase" 
                          : "bg-white text-black uppercase italic"
                      )}
                    >
                      3X
                    </button>
                  </div>
                  
                  <p className="mt-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Cost: {costText} per roll
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Probability List (Conditional) */}
            <AnimatePresence>
              {showOdds && !wonPrizes && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full max-w-md bg-brand-nav rounded-2xl border border-white/5 p-4 sm:p-8 accent-shadow mb-8 overflow-hidden"
                >
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 sm:mb-6">Odds & Probabilities</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {prizes.slice(0, 10).map((prize) => (
                      <div key={prize.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={cn(
                            "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full",
                            prize.rarity === 'legendary' ? "bg-amber-500" : 
                            prize.rarity === 'epic' ? "bg-purple-500" : 
                            prize.rarity === 'rare' ? "bg-indigo-500" : 
                            prize.rarity === 'uncommon' ? "bg-blue-500" : "bg-slate-700"
                          )} />
                          <span className="text-[11px] sm:text-sm font-bold text-slate-400 transition-colors group-hover:text-white truncate max-w-[150px] sm:max-w-[200px]">{prize.name}</span>
                        </div>
                        <span className="text-[9px] sm:text-xs font-mono text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">{(prize.probability * 100).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
