export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: HeadersInit;
  requiresAuth?: boolean;
  authToken?: string;
  query?: Record<string, QueryValue>;
}

export interface ApiError {
  name: 'ApiError';
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
}

interface ErrorPayload {
  message?: unknown;
  error?: unknown;
  code?: unknown;
  details?: unknown;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';

let authTokenProvider: (() => string | null | undefined) | null = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage.getItem('authToken');
};

export function setAuthTokenProvider(provider: (() => string | null | undefined) | null): void {
  authTokenProvider = provider;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = new URL(`${base}${normalizedPath}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, String(item));
        });
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}

function normalizeError(error: unknown, status = 0): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      name: 'ApiError',
      message: error.message || 'Unknown request error',
      status,
      cause: error,
    };
  }

  return {
    name: 'ApiError',
    message: 'Unknown request error',
    status,
    cause: error,
  };
}

function isApiError(value: unknown): value is ApiError {
  return !!value && typeof value === 'object' && (value as ApiError).name === 'ApiError';
}

function asErrorPayload(data: unknown): ErrorPayload {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return data as ErrorPayload;
}

async function parseResponseBody<T>(response: Response): Promise<T | null> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text as T;
  }

  return (await response.json()) as T;
}

export async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, headers, requiresAuth = false, authToken, query, ...rest } = options;
  const resolvedToken = authToken ?? authTokenProvider?.() ?? null;

  const requestHeaders = new Headers({
    Accept: 'application/json',
    ...headers,
  });

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    if (!resolvedToken) {
      throw normalizeError({
        name: 'ApiError',
        message: 'Authentication required',
        status: 401,
        code: 'AUTH_REQUIRED',
      });
    }

    requestHeaders.set('Authorization', `Bearer ${resolvedToken}`);
  }

  try {
    const response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const responseBody = await parseResponseBody<unknown>(response);

    if (!response.ok) {
      const payload = asErrorPayload(responseBody);
      throw normalizeError({
        name: 'ApiError',
        status: response.status,
        code: typeof payload.code === 'string' ? payload.code : undefined,
        details: payload.details ?? responseBody,
        message:
          (typeof payload.message === 'string' && payload.message) ||
          (typeof payload.error === 'string' && payload.error) ||
          `Request failed with status ${response.status}`,
      });
    }

    return responseBody as TResponse;
  } catch (error) {
    throw normalizeError(error);
  }
}

export function isApiRequestError(error: unknown): error is ApiError {
  return isApiError(error);
}
