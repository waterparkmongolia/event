import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ToastType } from '../../lib/toast';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
  error: {
    bg: 'bg-[#1a0f0f]',
    border: 'border-red-500/30',
    icon: <AlertCircle size={18} className="text-red-400 shrink-0" />,
  },
  success: {
    bg: 'bg-[#0f1a10]',
    border: 'border-emerald-500/30',
    icon: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
  },
  info: {
    bg: 'bg-[#111113]',
    border: 'border-white/10',
    icon: <Info size={18} className="text-amber-400 shrink-0" />,
  },
};

let nextId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = ++nextId;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const s = STYLES[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${s.bg} ${s.border} shadow-xl pointer-events-auto`}
            >
              {s.icon}
              <p className="flex-1 text-sm font-semibold text-white leading-snug">{t.message}</p>
              <button
                type="button"
                title="Хаах"
                onClick={() => dismiss(t.id)}
                className="text-white/30 hover:text-white/70 transition-colors mt-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
