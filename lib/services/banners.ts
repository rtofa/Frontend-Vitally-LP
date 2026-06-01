import api from '../api';
import type { Banner, BannerCreatePayload, BannerUpdatePayload } from '../api-types';

// 1. Busca TODOS os banners ativos (Para a loja pública)
export async function getActiveBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>('/banners/active');
  return data;
}

// 2. Busca TODOS os banners (Para a tabela do Painel Admin)
export async function getBanners(): Promise<Banner[]> {
  const { data } = await api.get('/banners');
  // Trava de segurança para paginação (caso o Java envie data.content)
  if (Array.isArray(data)) {
    return data;
  }
  return data?.content ?? [];
}

// 3. Busca APENAS UM banner pelo ID (Para o formulário de Edição)
export async function getBanner(id: string | number): Promise<Banner> {
  // Retorna apenas um objeto Banner, não um Array
  const { data } = await api.get<Banner>(`/banners/${id}`);
  return data;
}

// 4. Cria um novo banner
export async function createBanner(payload: BannerCreatePayload): Promise<Banner> {
  const { data } = await api.post<Banner>('/banners', payload);
  return data;
}

// 5. Atualiza os dados de um banner (Edição)
export async function updateBanner(id: string | number, payload: Partial<Banner>): Promise<Banner> {
  const { data } = await api.patch<Banner>(`/banners/${id}`, payload);
  return data;
}

// 6. Exclui um banner
export async function deleteBanner(id: string | number) {
  const { data } = await api.delete(`/banners/${id}`);
  return data;
}

// 7. Ativa ou Desativa um banner
export async function updateBannerStatus(id: string | number, payload: { active: boolean }) {
  // Passando o booleano como parâmetro na URL para o Spring Boot aceitar
  const { data } = await api.patch(`/banners/${id}/status`, null, {
    params: {
      isActive: payload.active
    }
  });
  return data;
}