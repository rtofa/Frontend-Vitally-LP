'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLeads } from '@/lib/services/leads';
import type { Lead } from '@/lib/api-types';

export function useLeads() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getLeads();
      // Compatibilidade com Spring Boot: resposta pode ser array ou paginada
      const leadsArray = Array.isArray(response) ? response : (response as any)?.content ?? [];
      setItems(leadsArray);
    } catch (err) {
      console.error('Erro ao carregar leads:', err);
      setError('Falha ao carregar leads. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Computed values úteis para o dashboard
  const totalLeads = items.length;
  const quoteLeads = items.filter((l) => l.type === 'QUOTE').length;
  const contactLeads = items.filter((l) => l.type === 'CONTACT').length;
  const recentLeads = items.slice(0, 5);

  return {
    items,
    loading,
    error,
    load,
    // Stats computados para o dashboard
    totalLeads,
    quoteLeads,
    contactLeads,
    recentLeads,
  };
}
