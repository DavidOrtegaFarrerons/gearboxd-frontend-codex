import { http } from './http';

export type AuthenticationTokenPayload = {
  email: string;
  password: string;
};

export type AuthenticationTokenResponse = {
  token: string;
};

export function getAuthenticationToken(
  payload: AuthenticationTokenPayload,
): Promise<AuthenticationTokenResponse> {
  return http<AuthenticationTokenResponse>('/v1/tokens/authentication', {
    method: 'POST',
    body: payload,
  });
}
