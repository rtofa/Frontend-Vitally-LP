'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLeads } from '@/hooks/admin/useLeads';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { Lead } from '@/lib/api-types';

const PERIOD_OPTIONS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
  { label: 'Todos', days: 0 },
] as const;

const PIE_COLORS = ['#39FF14', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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

function filterByPeriod(leads: Lead[], days: number): Lead[] {
  if (days === 0) return leads;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return leads.filter((lead) => {
    if (!lead.createdAt) return false;
    const created = new Date(lead.createdAt);
    return !Number.isNaN(created.getTime()) && created >= cutoff;
  });
}

function buildTypeData(leads: Lead[]) {
  const counts: Record<string, number> = {};
  leads.forEach((lead) => {
    const key = lead.type === 'QUOTE' ? 'Orçamento' : 'Contato';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildStateData(leads: Lead[]) {
  const counts: Record<string, number> = {};
  leads.forEach((lead) => {
    const key = lead.state || 'Não informado';
    counts[key] = (counts[key] || 0) + 1;
  });
  // Sort descending and take top 6, grouping the rest as "Outros"
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const otherSum = sorted.slice(6).reduce((acc, [, v]) => acc + v, 0);
  const result = top.map(([name, value]) => ({ name, value }));
  if (otherSum > 0) result.push({ name: 'Outros', value: otherSum });
  return result;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white text-sm font-semibold">{name}</p>
      <p className="text-white/60 text-xs">{value} lead(s)</p>
    </div>
  );
};

const renderLegendText = (value: string) => (
  <span className="text-white/60 text-xs">{value}</span>
);

export default function AdminDashboardPage() {
  const { items, loading, error, totalLeads, quoteLeads, contactLeads, recentLeads } = useLeads();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [chartView, setChartView] = useState<'type' | 'state'>('type');

  const filteredLeads = useMemo(() => filterByPeriod(items, selectedPeriod), [items, selectedPeriod]);
  const typeData = useMemo(() => buildTypeData(filteredLeads), [filteredLeads]);
  const stateData = useMemo(() => buildStateData(filteredLeads), [filteredLeads]);

  const chartData = chartView === 'type' ? typeData : stateData;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Vitally Admin</div>
        <h1 className="text-white text-3xl font-black">Painel</h1>
        <p className="text-white/50 text-sm">Acompanhe o catálogo high-ticket, banners e leads recebidos.</p>
      </header>

      {/* KPI Cards */}
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

      {/* 50/50 Split: Leads + Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Leads */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
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
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
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
        </div>

        {/* Right: Pie Chart */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-white text-lg font-bold">Distribuição de Leads</h2>
            <div className="flex items-center gap-2">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setSelectedPeriod(opt.days)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                    selectedPeriod === opt.days
                      ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                      : 'border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart View Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartView('type')}
              className={`h-7 px-3 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                chartView === 'type'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Por Tipo
            </button>
            <button
              onClick={() => setChartView('state')}
              className={`h-7 px-3 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                chartView === 'state'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Por Estado
            </button>
          </div>

          {loading && <div className="text-white/40 text-sm flex-1 flex items-center justify-center">Carregando...</div>}

          {!loading && filteredLeads.length === 0 && (
            <div className="text-white/40 text-sm flex-1 flex items-center justify-center">
              Nenhum lead encontrado no período selecionado.
            </div>
          )}

          {!loading && filteredLeads.length > 0 && (
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={renderLegendText}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="text-white/30 text-xs text-center mt-3">
            {filteredLeads.length} lead(s) no período
          </div>
        </div>
      </section>

      {/* Support & Evolution CTA */}
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
