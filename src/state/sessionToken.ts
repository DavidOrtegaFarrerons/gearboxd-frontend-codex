const TOKEN_STORAGE_KEY = 'gearboxd-token';

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
