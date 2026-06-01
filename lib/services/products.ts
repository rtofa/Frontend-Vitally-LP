import api from '../api';
import type {
  ApiProduct,
  PageResponse,
  ProductCreatePayload,
  ProductUpdatePayload,
} from '../api-types';

export async function getProducts(): Promise<ApiProduct[]> {
  const { data } = await api.get<ApiProduct[] | PageResponse<ApiProduct>>('/products', {
    params: {
      search: '',
      page: 0,
      size: 20
    }
  });
  if (Array.isArray(data)) {
    return data;
  }
  return data?.content ?? [];
}

export async function getProductsPage(params: { page?: number; size?: number }) {
  const { data } = await api.get<PageResponse<ApiProduct>>('/products', { params });
  return data;
}

export async function getProduct(id: string | number): Promise<ApiProduct> {
  const { data } = await api.get<ApiProduct>(`/products/${id}`);
  return data;
}

export async function updateProduct(id: string | number, payload: ProductUpdatePayload) {
  const { data } = await api.put<ApiProduct>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string | number) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function activateProduct(id: string | number) {
  const { data } = await api.patch(`/products/${id}/activate`);
  return data;
}

export async function deactivateProduct(id: string | number) {
  const { data } = await api.patch(`/products/${id}/deactivate`);
  return data;
}

export async function createProduct(payload: ProductCreatePayload): Promise<ApiProduct> {
  const { data } = await api.post<ApiProduct>('/products', payload);
  return data;
}
