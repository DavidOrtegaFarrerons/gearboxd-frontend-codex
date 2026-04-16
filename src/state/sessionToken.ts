const TOKEN_STORAGE_KEY = 'gearboxd-token';
const LEGACY_AUTH_TOKEN_KEY = 'auth_token';

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    sessionStorage.getItem(TOKEN_STORAGE_KEY)
    ?? localStorage.getItem(TOKEN_STORAGE_KEY)
    ?? localStorage.getItem(LEGACY_AUTH_TOKEN_KEY)
  );
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(LEGACY_AUTH_TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}
