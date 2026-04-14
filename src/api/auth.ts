import { request } from './http';

export interface AuthenticationTokenPayload {
  email: string;
  password: string;
}

export interface AuthenticationTokenResponse {
  token: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export async function getAuthenticationToken(
  payload: AuthenticationTokenPayload,
): Promise<AuthenticationTokenResponse> {
  return request<AuthenticationTokenResponse>('/v1/tokens/authentication', {
    method: 'POST',
    body: payload,
  });
}
