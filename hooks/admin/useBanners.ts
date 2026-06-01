'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  createBanner,
  deleteBanner,
  getBanner,
  getBanners,
  updateBanner,
  updateBannerStatus,
} from '@/lib/services/banners';
import type { Banner, BannerCreatePayload, BannerUpdatePayload } from '@/lib/api-types';

export function useBanners() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | number | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBanners();
      setItems(data);
    } catch {
      setError('Erro ao carregar banners.');
      toast.error('Erro ao carregar banners do servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload: BannerCreatePayload) => {
    setSaving(true);
    try {
      const created = await createBanner(payload);
      setItems((prev) => [created, ...prev]);
      toast.success('Banner publicado com sucesso.');
      return created;
    } catch {
      toast.error('Erro ao criar o banner.');
      throw new Error('create failed');
    } finally {
      setSaving(false);
    }
  };

  const edit = async (id: string | number, payload: BannerUpdatePayload) => {
    setSaving(true);
    try {
      const updated = await updateBanner(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success('Banner atualizado com sucesso.');
      return updated;
    } catch {
      toast.error('Erro ao atualizar o banner.');
      throw new Error('edit failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (banner: Banner) => {
    if (typeof banner.id === 'undefined') return;
    const isActive = typeof banner.active === 'boolean' ? banner.active : false;
    setActionId(banner.id);
    try {
      await updateBannerStatus(banner.id, { active: !isActive });
      await load();
      toast.success(isActive ? 'Banner desativado.' : 'Banner ativado.');
    } catch {
      toast.error('Erro ao atualizar o status do banner.');
    } finally {
      setActionId(null);
    }
  };

  const remove = async (id: string | number) => {
    setActionId(id);
    try {
      await deleteBanner(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Banner excluído.');
    } catch {
      toast.error('Erro ao excluir o banner.');
    } finally {
      setActionId(null);
    }
  };

  const findById = async (id: string | number) => getBanner(id);

  return {
    items,
    loading,
    saving,
    actionId,
    error,
    load,
    create,
    edit,
    toggleStatus,
    remove,
    findById,
  };
}
