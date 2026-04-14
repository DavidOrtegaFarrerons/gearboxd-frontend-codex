import { http } from './http';

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
};

export type ActivatePayload = {
  token: string;
};

export function register(payload: RegisterPayload): Promise<void> {
  return http<void>('/v1/users', {
    method: 'POST',
    body: payload,
  });
}

export function activate(payload: ActivatePayload): Promise<void> {
  return http<void>('/v1/users/activated', {
    method: 'PUT',
    body: payload,
  });
}
