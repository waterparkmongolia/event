import { useState } from 'react';
import { User, Lock, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthPageProps {
  onLogin: (username: string, password: string) => Promise<string | null>;
  onRegister: (username: string, phone: string, password: string) => Promise<string | null>;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password !== confirmPassword) { setError('Нууц үг таарахгүй байна.'); return; }
      if (password.length < 6) { setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'); return; }
    }

    setSubmitting(true);
    const err = mode === 'register'
      ? await onRegister(username.trim(), phone.trim(), password)
      : await onLogin(username.trim(), password);
    setSubmitting(false);
    if (err) setError(err);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setUsername('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            Event<span className="text-amber-500">Hub</span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-widest">Шагналын систем</p>
        </div>

        <div className="flex bg-[#161618] border border-white/5 rounded-xl p-1 mb-5">
          <button type="button" onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-white'}`}>
            Нэвтрэх
          </button>
          <button type="button" onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'register' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-white'}`}>
            Бүртгүүлэх
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-5 space-y-3 mb-4">

            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input type="text" placeholder="Хэрэглэгчийн нэр" value={username}
                onChange={e => setUsername(e.target.value)} required autoComplete="username"
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-black/60 transition-all" />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input type="tel" placeholder="Утасны дугаар" value={phone}
                  onChange={e => setPhone(e.target.value)} required autoComplete="tel"
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-black/60 transition-all" />
              </div>
            )}

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Нууц үг" value={password}
                onChange={e => setPassword(e.target.value)} required
                autoComplete="current-password"
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-black/60 transition-all" />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Нууц үг давтах" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password"
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 focus:bg-black/60 transition-all" />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-xs font-semibold text-center">{error}</p>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-5">
          {mode === 'login' ? 'Бүртгэл байхгүй юу?' : 'Аль хэдийн бүртгэлтэй юу?'}
          {' '}
          <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
            {mode === 'login' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </p>
      </div>
    </div>
  );
}
