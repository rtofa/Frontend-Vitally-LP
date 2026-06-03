'use client';

import Link from 'next/link';
import { useLeads } from '@/hooks/admin/useLeads';

const formatDate = (value?: string) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const formatLocation = (city?: string, state?: string) => {
  if (city && state) return `${city} - ${state}`;
  if (city) return city;
  if (state) return state;
  return '--';
};

export default function AdminDashboardPage() {
  const { loading, error, totalLeads, quoteLeads, contactLeads, recentLeads } = useLeads();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Vitally Admin</div>
        <h1 className="text-white text-3xl font-black">Painel</h1>
        <p className="text-white/50 text-sm">Acompanhe o catálogo high-ticket, banners e leads recebidos.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="text-white/50 text-xs uppercase tracking-widest">Total de Leads</div>
          <div className="text-white text-3xl font-black mt-2">{loading ? '...' : totalLeads}</div>
          <div className="text-white/30 text-xs mt-1">Cadastros recebidos</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-white/50 text-xs uppercase tracking-widest">Orçamentos</div>
          <div className="text-[#39FF14] text-3xl font-black mt-2">{loading ? '...' : quoteLeads}</div>
          <div className="text-white/30 text-xs mt-1">Requisições QUOTE</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-white/50 text-xs uppercase tracking-widest">Contatos</div>
          <div className="text-blue-400 text-3xl font-black mt-2">{loading ? '...' : contactLeads}</div>
          <div className="text-white/30 text-xs mt-1">Requisições CONTACT</div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Últimos Leads</h2>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold uppercase tracking-widest text-[#39FF14] hover:text-[#53FF2E] transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {loading && <div className="text-white/40 text-sm">Carregando leads...</div>}
        {error && <div className="text-rose-400 text-sm">{error}</div>}

        {!loading && !error && recentLeads.length === 0 && (
          <div className="text-white/40 text-sm">Nenhum lead cadastrado ainda.</div>
        )}

        {!loading && !error && recentLeads.length > 0 && (
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <div
                key={lead.id ?? `${lead.email}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-white/10 bg-black/40 hover:border-white/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{lead.name ?? 'Sem nome'}</div>
                  <div className="text-white/50 text-xs mt-1">{lead.email ?? '--'}</div>
                  <div className="text-white/40 text-xs mt-1">{formatLocation(lead.city, lead.state)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold tracking-wider whitespace-nowrap ${
                      lead.type === 'QUOTE'
                        ? 'bg-[#39FF14]/10 text-[#39FF14]'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {lead.type ?? 'CONTACT'}
                  </span>
                  <span className="text-white/40 text-xs">{formatDate(lead.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-white text-lg font-bold">
              Precisa de ajuda ou encontrou algum bug?
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Nossa equipe técnica está à disposição para garantir que sua operação não pare.
            </p>
          </div>
          <a
            href="https://wa.me/5514997811200?text=Olá,%20preciso%20de%20suporte%20no%20painel%20da%20Vitally."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-colors"
          >
            Reportar Bug
          </a>
        </div>
        
        <div className="hidden md:block w-px h-24 bg-white/10" />
        <div className="md:hidden w-full h-px bg-white/10" />

        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-white text-lg font-bold">
              Deseja implementar novas funcionalidades?
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Converse com nossa equipe de engenharia para escalar ainda mais a sua plataforma.
            </p>
          </div>
          <a
            href="https://wa.me/5514997811200?text=Olá,%20gostaria%20de%20orçar%20uma%20nova%20funcionalidade%20para%20a%20Vitally."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-white/15 text-white/70 text-sm font-bold uppercase tracking-wider hover:text-white hover:border-[#39FF14]/60 hover:bg-[#39FF14]/10 transition-colors"
          >
            Solicitar Funcionalidade
          </a>
        </div>
      </section>
    </div>
  );
}
