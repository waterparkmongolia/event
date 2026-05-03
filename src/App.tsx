import { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { AuthPage } from './components/auth/AuthPage';
import { EventsView } from './components/views/EventsView';
import { ItemsView } from './components/views/ItemsView';
import { MarketView } from './components/views/MarketView';
import { AdminView } from './components/views/AdminView';
import { useGameState } from './hooks/useGameState';
import { useAuth } from './hooks/useAuth';
import { CheckSquare, Calendar, Sparkles, User, Facebook, Instagram, Youtube, Share2, ShoppingBag } from 'lucide-react';

export default function App() {
  const { user, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const { stats, openPool, addCustomPool, earnSilverKeys, earnGoldenKeys, purchaseItem, sellItem } = useGameState();

  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  const tasks = [
    { id: 'fb', title: 'Facebook дагах', reward: '1 Мөнгөн Түлхүүр', icon: <Facebook size={18} />, type: 'key', keyType: 'silver' },
    { id: 'ig', title: 'Instagram дагах', reward: '1 Мөнгөн Түлхүүр', icon: <Instagram size={18} />, type: 'key', keyType: 'silver' },
    { id: 'yt', title: 'YouTube дагах', reward: '1 Мөнгөн Түлхүүр', icon: <Youtube size={18} />, type: 'key', keyType: 'silver' },
    { id: 'ref', title: 'Найзаа урих', reward: '1 Алтан Түлхүүр', icon: <Share2 size={18} />, type: 'key', keyType: 'golden' },
    { id: 'checkin', title: 'Өдөр тутмын бүртгэл', reward: '50 Оноо', icon: <Calendar size={18} />, type: 'points' },
  ];

  const handleTask = (task: any) => {
    if (task.type === 'key') {
      if (task.keyType === 'golden') {
        earnGoldenKeys(1);
        alert(`${task.title} амжилттай! 1 Алтан Түлхүүр нэмэгдлээ.`);
      } else {
        earnSilverKeys(1);
        alert(`${task.title} амжилттай! 1 Мөнгөн Түлхүүр нэмэгдлээ.`);
      }
    } else {
      alert('Тун удахгүй...');
    }
  };

  return (
    <Shell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userPoints={stats.points}
      userBalance={stats.balance}
      userDollarBalance={stats.dollarBalance}
      totalEarnings={stats.totalEarnings}
      totalDollarEarnings={stats.totalDollarEarnings}
      userKeys={stats.goldenKeys}
      silverKeys={stats.silverKeys}
      tickets={stats.tickets}
      tickets2027={stats.tickets2027}
      username={user.username}
      onLogout={logout}
    >
      {activeTab === 'events' && (
        <EventsView 
          stats={stats} 
          onOpen={openPool} 
        />
      )}

      {activeTab === 'admin' && (
        <AdminView onAddPool={addCustomPool} />
      )}

      {activeTab === 'items' && (
        <ItemsView inventory={stats.inventory} points={stats.points} />
      )}

      {activeTab === 'market' && (
        <MarketView 
          points={stats.points} 
          ticketsCount={stats.tickets}
          soldTicketsCount={stats.soldTicketsCount} 
          onPurchase={purchaseItem} 
          onSell={sellItem}
        />
      )}

      {activeTab === 'tasks' && (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-10">
          <header className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-4xl font-light text-white">Daily <span className="font-bold">Challenges</span></h1>
            <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Complete missions to earn keys and points.</p>
          </header>
          
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {tasks.map((task, i) => (
              <div key={task.id} className="bg-[#161618] border border-white/5 p-3 sm:p-6 rounded-2xl flex items-center justify-between transition-all">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                    {task.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-lg font-bold text-white uppercase italic truncate max-w-[120px] sm:max-w-none">{task.title}</h4>
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest">Available Now</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 sm:gap-3">
                  <span className="text-[10px] sm:text-lg font-black text-amber-500 uppercase italic leading-none">{task.reward}</span>
                  <button 
                    onClick={() => handleTask(task)}
                    className="px-2 py-1 sm:px-6 sm:py-2 bg-white/10 border border-white/10 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-black transition-all"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}
