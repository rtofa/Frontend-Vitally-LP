import api from '../api';
import type { AuthResponse, LoginPayload } from '../api-types';

type LoginResponse = {
  token?: string;
  accessToken?: string;
  jwt?: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  const token = data.token || data.accessToken || data.jwt;
  if (!token) {
    throw new Error('Missing auth token in response.');
  }
  return { token };
}
