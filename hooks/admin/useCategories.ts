'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  activateCategory,
  createCategory,
  deactivateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '@/lib/services/categories';
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from '@/lib/api-types';

export function useCategories(defaultSize = 10) {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (pageToLoad = currentPage) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories(pageToLoad, defaultSize);
      setItems(data.content);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setError('Erro ao carregar categorias.');
      toast.error('Erro ao carregar categorias do servidor.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, defaultSize]);

  useEffect(() => {
    load(currentPage);
  }, [currentPage]); // automatically fetches when currentPage changes

  const create = async (payload: CategoryCreatePayload) => {
    setSaving(true);
    try {
      const created = await createCategory(payload);
      setItems((prev) => [created, ...prev]);
      toast.success('Categoria criada com sucesso.');
      return created;
    } catch {
      toast.error('Erro ao criar a categoria.');
      throw new Error('create failed');
    } finally {
      setSaving(false);
    }
  };

  const edit = async (id: string, payload: CategoryUpdatePayload) => {
    setSaving(true);
    try {
      const updated = await updateCategory(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success('Categoria atualizada com sucesso.');
      return updated;
    } catch {
      toast.error('Erro ao atualizar a categoria.');
      throw new Error('edit failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (category: Category) => {
    setActionId(category.id);
    try {
      if (category.active) {
        await deactivateCategory(category.id);
      } else {
        await activateCategory(category.id);
      }
      await load();
      toast.success(category.active ? 'Categoria desativada.' : 'Categoria ativada.');
    } catch {
      toast.error('Erro ao atualizar o status da categoria.');
    } finally {
      setActionId(null);
    }
  };

  const remove = async (id: string) => {
    setActionId(id);
    try {
      await deleteCategory(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Categoria excluída.');
    } catch {
      toast.error('Erro ao excluir a categoria.');
    } finally {
      setActionId(null);
    }
  };

  const findById = async (id: string) => getCategory(id);

  const nextPage = () => setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : p));
  const prevPage = () => setCurrentPage((p) => (p > 0 ? p - 1 : p));

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
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  };
}
