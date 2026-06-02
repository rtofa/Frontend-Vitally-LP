import api from '../api';
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from '../api-types';

export async function getCategories(page = 0, size = 10) {
  const { data } = await api.get(`/categories?page=${page}&size=${size}`);
  
  if (Array.isArray(data)) {
    return { content: data, totalPages: 1, currentPage: 0 };
  }
  
  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
    currentPage: data?.currentPage ?? data?.number ?? 0,
  };
}

export async function createCategory(payload: CategoryCreatePayload): Promise<Category> {
  const { data } = await api.post<Category>('/categories', payload);
  return data;
}

export async function getCategory(id: string) {
  const { data } = await api.get<Category>(`/categories/${id}`);
  return data;
}

export async function updateCategory(id: string, payload: CategoryUpdatePayload): Promise<Category> {
  const { data } = await api.put<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

export async function activateCategory(id: string) {
  const { data } = await api.patch(`/categories/${id}/activate`);
  return data;
}

export async function deactivateCategory(id: string) {
  const { data } = await api.patch(`/categories/${id}/deactivate`);
  return data;
}
