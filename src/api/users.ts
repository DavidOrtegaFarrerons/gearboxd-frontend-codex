import { request } from './http';

export interface RegisterPayload {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterResponse {
  userId: string;
  message?: string;
  [key: string]: unknown;
}

export interface ActivatePayload {
  token: string;
}

export interface ActivateResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/v1/users/register', {
    method: 'POST',
    body: payload,
  });
}

export async function activate(payload: ActivatePayload): Promise<ActivateResponse> {
  return request<ActivateResponse>('/v1/users/activate', {
    method: 'POST',
    body: payload,
  });
}
