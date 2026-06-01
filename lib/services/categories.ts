import api from '../api';
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from '../api-types';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  
  if (Array.isArray(data)) {
    return data;
  }
  return data?.content ?? [];
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
