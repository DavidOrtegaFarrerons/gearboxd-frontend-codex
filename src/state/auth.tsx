import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { clearSessionToken, getSessionToken, setSessionToken } from './sessionToken';
import { getAuthenticationToken } from '../api/auth';
import { extractFieldErrors, type FieldErrors } from '../api/errors';

export type AuthError = {
  status: number;
  code: string;
  message: string;
  fieldErrors?: FieldErrors;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  parseAuthError: (response: Response) => Promise<AuthError>;
  registerProtectedCacheReset: (resetFn: () => void) => () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const authErrorMessages: Record<number, string> = {
  401: 'Your session is not valid. Please log in and try again.',
  403: 'You do not have permission to perform this action.',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getSessionToken());
  const [cacheResetHandlers, setCacheResetHandlers] = useState<Array<() => void>>(
    [],
  );

  const registerProtectedCacheReset = useCallback((resetFn: () => void) => {
    setCacheResetHandlers((previous) => [...previous, resetFn]);

    return () => {
      setCacheResetHandlers((previous) =>
        previous.filter((handler) => handler !== resetFn),
      );
    };
  }, []);

  const persistToken = useCallback((nextToken: string | null) => {
    setToken(nextToken);

    if (nextToken) {
      setSessionToken(nextToken);
      return;
    }

    clearSessionToken();
  }, []);

  const logout = useCallback(() => {
    persistToken(null);

    cacheResetHandlers.forEach((reset) => reset());
  }, [cacheResetHandlers, persistToken]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const { token: nextToken } = await getAuthenticationToken(credentials);
        persistToken(nextToken);
      } catch (error) {
        if (
          error
          && typeof error === 'object'
          && 'status' in error
          && 'code' in error
          && 'message' in error
        ) {
          throw error as AuthError;
        }

        throw {
          status: 500,
          code: 'AUTHENTICATION_FAILED',
          message: 'Login failed.',
        } satisfies AuthError;
      }
    },
    [persistToken],
  );

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers ?? undefined);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return fetch(input, {
        ...init,
        headers,
      });
    },
    [token],
  );

  const parseAuthError = useCallback(async (response: Response): Promise<AuthError> => {
    return parseAuthErrorResponse(response);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      authFetch,
      parseAuthError,
      registerProtectedCacheReset,
    }),
    [
      authFetch,
      login,
      logout,
      parseAuthError,
      registerProtectedCacheReset,
      token,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function PublicReadGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

type WriteActionGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function WriteActionGuard({ children, fallback }: WriteActionGuardProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {fallback ?? (
        <p role="alert">Log in to create, edit, or delete content.</p>
      )}
    </>
  );
}

export function useRequireAuthAction() {
  const { isAuthenticated } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);

  const runOrPrompt = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | null> => {
      if (isAuthenticated) {
        return action();
      }

      setPromptOpen(true);
      return null;
    },
    [isAuthenticated],
  );

  const dismissPrompt = useCallback(() => setPromptOpen(false), []);

  return {
    runOrPrompt,
    promptOpen,
    dismissPrompt,
    promptMessage: 'Please log in to perform this action.',
  };
}

export async function parseAuthErrorResponse(response: Response): Promise<AuthError> {
  const defaultMessage = authErrorMessages[response.status]
    ?? 'Something went wrong while processing your request.';

  try {
    const body = (await response.json()) as {
      error?: { code?: string; message?: string };
    };
    const fieldErrors = extractFieldErrors(body);
    const firstFieldError = fieldErrors ? Object.values(fieldErrors)[0] : undefined;

    return {
      status: response.status,
      code: body.error?.code ?? 'UNKNOWN_ERROR',
      message: body.error?.message ?? firstFieldError ?? defaultMessage,
      fieldErrors,
    };
  } catch {
    return {
      status: response.status,
      code: 'UNKNOWN_ERROR',
      message: defaultMessage,
    };
  }
}
