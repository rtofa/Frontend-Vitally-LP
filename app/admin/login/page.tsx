'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/services/auth';
import { getAuthToken, setAuthToken } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getAuthToken()) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token } = await login({ email, password });
      setAuthToken(token);
      router.push('/admin');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8">
        <div className="mb-6 text-center">
          <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.35em]">Vitally</div>
          <h1 className="text-white text-2xl font-black mt-2">Acesso Admin</h1>
          <p className="text-white/50 text-sm mt-1">Entre para gerenciar produtos e campanhas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors"
              placeholder="admin@vitally.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && <div className="text-rose-400 text-xs font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
