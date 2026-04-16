import { extractFieldErrors, type FieldErrors } from './errors';

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  fieldErrors?: FieldErrors;
};

export type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeApiError(response: Response, payload: unknown): ApiError {
  const fallbackMessage = response.statusText || 'Request failed.';
  const fieldErrors = extractFieldErrors(payload);
  const firstFieldError = fieldErrors ? Object.values(fieldErrors)[0] : undefined;

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const nestedError = record.error && typeof record.error === 'object'
      ? (record.error as Record<string, unknown>)
      : undefined;

    const code = typeof nestedError?.code === 'string'
      ? nestedError.code
      : typeof record.code === 'string'
        ? record.code
        : 'API_ERROR';

    const message = typeof nestedError?.message === 'string'
      ? nestedError.message
      : typeof record.message === 'string'
        ? record.message
        : firstFieldError ?? fallbackMessage;

    const details = nestedError?.details ?? record.details;

    return {
      status: response.status,
      code,
      message,
      details,
      fieldErrors,
    };
  }

  return {
    status: response.status,
    code: 'API_ERROR',
    message: firstFieldError ?? fallbackMessage,
    fieldErrors,
  };
}

export async function http<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, token, headers, ...init } = options;

  const mergedHeaders = new Headers(headers);
  mergedHeaders.set('Accept', 'application/json');

  if (body !== undefined && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    mergedHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(joinUrl(API_BASE_URL, path), {
    ...init,
    headers: mergedHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw normalizeApiError(response, payload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return payload as TResponse;
}
