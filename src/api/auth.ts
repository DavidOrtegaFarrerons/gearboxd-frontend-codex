import { http } from './http';

export type AuthenticationTokenPayload = {
  email: string;
  password: string;
};

export type AuthenticationTokenResponse = {
  token: string;
};

type AuthenticationPayloadShape = {
  token?: string;
  authentication_token?: {
    token?: string;
  };
};

export async function getAuthenticationToken(
  payload: AuthenticationTokenPayload,
): Promise<AuthenticationTokenResponse> {
  const response = await http<AuthenticationPayloadShape>('/v1/tokens/authentication', {
    method: 'POST',
    body: payload,
  });

  const token = response.token ?? response.authentication_token?.token;

  if (!token) {
    throw new Error('Authentication succeeded but no token was returned by the API.');
  }

  return { token };
}
