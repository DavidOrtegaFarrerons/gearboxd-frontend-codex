export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface ActivatePayload {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}
