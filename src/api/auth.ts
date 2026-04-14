import { apiClient } from './client';
import type { ActivatePayload, AuthTokenResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const authApi = {
  register: (payload: RegisterPayload) => apiClient.post<void>('/auth/register', payload),
  activate: (payload: ActivatePayload) => apiClient.post<void>('/auth/activate', payload),
  login: (payload: LoginPayload) => apiClient.post<AuthTokenResponse>('/auth/token', payload)
};
