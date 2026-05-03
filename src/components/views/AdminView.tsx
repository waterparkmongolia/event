import React, { useState } from 'react';
import { PrizePool, Prize, Rarity } from '../../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface AdminViewProps {
  onAddPool: (pool: PrizePool) => void;
}

export function AdminView({ onAddPool }: AdminViewProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [costPoints, setCostPoints] = useState(0);
  const [costSilver, setCostSilver] = useState(0);
  const [costGold, setCostGold] = useState(0);
  const [costTicket, setCostTicket] = useState(0);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  const addPrize = () => {
    const newPrize: Prize = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      probability: 0.01,
      rarity: 'common'
    };
    setPrizes([...prizes, newPrize]);
  };

  const updatePrize = (index: number, updates: Partial<Prize>) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], ...updates };
    setPrizes(newPrizes);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name || prizes.length === 0) {
      alert('Нэр болон дор хаяж нэг шагнал оруулна уу.');
      return;
    }

    const totalProb = prizes.reduce((sum, p) => sum + p.probability, 0);
    if (Math.abs(totalProb - 1) > 0.001) {
       if (!confirm(`Нийт магадлал ${ (totalProb * 100).toFixed(2) }% байна. (100% байх ёстой). Үргэлжлүүлэх үү?`)) return;
    }

    const newPool: PrizePool = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      type: 'custom',
      cost: {
        points: costPoints || undefined,
        silverKeys: costSilver || undefined,
        goldenKeys: costGold || undefined,
        tickets: costTicket || undefined,
      },
      prizes: prizes
    };

    onAddPool(newPool);
    alert('Амжилттай нэмэгдлээ!');
    // Reset
    setName('');
    setDescription('');
    setPrizes([]);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-xl sm:text-4xl font-light text-white">Admin <span className="font-bold">Panel</span></h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Create and manage prize pools.</p>
      </header>

      <div className="bg-[#161618] border border-white/5 p-6 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Pool Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., iPhone 15 Pro Pool"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the pool items..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all h-24"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Costs (Per Roll)</label>
            <div className="grid grid-cols-3 gap-2">
               <div>
                <span className="text-[8px] text-slate-600 block mb-1">Points</span>
                <input type="number" value={costPoints} onChange={(e) => setCostPoints(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs"/>
               </div>
               <div>
                <span className="text-[8px] text-slate-600 block mb-1">Silver</span>
                <input type="number" value={costSilver} onChange={(e) => setCostSilver(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs"/>
               </div>
               <div>
                <span className="text-[8px] text-slate-600 block mb-1">Gold</span>
                <input type="number" value={costGold} onChange={(e) => setCostGold(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs"/>
               </div>
               <div>
                <span className="text-[8px] text-slate-600 block mb-1">Ticket</span>
                <input type="number" value={costTicket} onChange={(e) => setCostTicket(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs"/>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Prize Items</h3>
            <button 
              onClick={addPrize}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white transition-all"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {prizes.map((prize, idx) => (
              <div key={prize.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-white/2 border border-white/5 rounded-2xl">
                <div className="col-span-5">
                  <label className="block text-[8px] text-slate-600 mb-1">Name</label>
                  <input 
                    value={prize.name}
                    onChange={(e) => updatePrize(idx, { name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[8px] text-slate-600 mb-1">Rate (%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={prize.probability * 100}
                    onChange={(e) => updatePrize(idx, { probability: Number(e.target.value) / 100 })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[8px] text-slate-600 mb-1">Rarity</label>
                  <select 
                    value={prize.rarity}
                    onChange={(e) => updatePrize(idx, { rarity: e.target.value as Rarity })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <button 
                    onClick={() => removePrize(idx)}
                    className="w-full py-2 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 bg-amber-500 text-black font-black uppercase italic rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <Save size={20} /> Save Prize Pool
        </button>
      </div>
    </div>
  );
}
