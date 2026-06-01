'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsPage,
  updateProduct,
} from '@/lib/services/products';
import type { ApiProduct, PageResponse, ProductCreatePayload, ProductUpdatePayload } from '@/lib/api-types';

const PAGE_SIZE = 10;

export function useProducts(paginated = false) {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [pageData, setPageData] = useState<PageResponse<ApiProduct> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | number | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (paginated) {
        const data = await getProductsPage({ page, size: PAGE_SIZE });
        setPageData(data);
        setItems(data.content ?? []);
      } else {
        const data = await getProducts();
        setItems(data);
      }
    } catch {
      setError('Erro ao carregar produtos.');
      toast.error('Erro ao carregar produtos do servidor.');
    } finally {
      setLoading(false);
    }
  }, [page, paginated]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload: ProductCreatePayload) => {
    setSaving(true);
    try {
      const created = await createProduct(payload);
      setItems((prev) => [created, ...prev]);
      toast.success('Produto criado com sucesso.');
      return created;
    } catch {
      toast.error('Erro ao criar o produto.');
      throw new Error('create failed');
    } finally {
      setSaving(false);
    }
  };

  const edit = async (id: string | number, payload: ProductUpdatePayload) => {
    setSaving(true);
    try {
      const updated = await updateProduct(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success('Produto atualizado com sucesso.');
      return updated;
    } catch {
      toast.error('Erro ao atualizar o produto.');
      throw new Error('edit failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (product: ApiProduct) => {
    if (typeof product.id === 'undefined' || typeof product.active !== 'boolean') return;
    setActionId(product.id);
    try {
      if (product.active) {
        await deactivateProduct(product.id);
      } else {
        await activateProduct(product.id);
      }
      await load();
      toast.success(product.active ? 'Produto desativado.' : 'Produto ativado.');
    } catch {
      toast.error('Erro ao atualizar o status do produto.');
    } finally {
      setActionId(null);
    }
  };

  const remove = async (id: string | number) => {
    setActionId(id);
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Produto excluído.');
    } catch {
      toast.error('Erro ao excluir o produto.');
    } finally {
      setActionId(null);
    }
  };

  const findById = async (id: string | number) => getProduct(id);

  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? items.length;
  const canPrev = page > 0;
  const canNext = totalPages > 0 ? page + 1 < totalPages : false;

  return {
    items,
    pageData,
    page,
    setPage,
    totalPages,
    totalElements,
    canPrev,
    canNext,
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
