import api from '../api';
import type { Lead, LeadCreatePayload, PageResponse } from '../api-types';

export async function createLead(payload: LeadCreatePayload) {
  const { data } = await api.post('/leads', payload);
  return data;
}

export async function getLeads() {
  const { data } = await api.get<Lead[] | PageResponse<Lead>>('/leads');
  if (Array.isArray(data)) {
    return data;
  }
  return data?.content ?? [];
}
