'use client';

import { useLeads } from '@/hooks/admin/useLeads';
import LeadsTable from '@/components/admin/leads/LeadsTable';

export default function LeadsPage() {
  const { items, loading, error, load } = useLeads();

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Leads</div>
        <h1 className="text-white text-3xl font-black">Leads cadastrados</h1>
        <p className="text-white/50 text-sm">Acompanhe os contatos e intenções de compra.</p>
      </header>

      <LeadsTable
        items={items}
        loading={loading}
        error={error}
        onRefresh={load}
      />
    </div>
  );
}