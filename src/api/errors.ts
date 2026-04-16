export type FieldErrors = Record<string, string>;

type ApiLikeError = {
  message?: string;
  fieldErrors?: FieldErrors;
  status?: number;
};

function toFieldErrors(value: unknown): FieldErrors | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([key, entry]) => key !== 'code' && key !== 'message' && typeof entry === 'string');

  if (!entries.length) {
    return undefined;
  }

  return Object.fromEntries(entries) as FieldErrors;
}

export function extractFieldErrors(payload: unknown): FieldErrors | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const nestedError = record.error;

  return toFieldErrors(record)
    ?? toFieldErrors(nestedError)
    ?? toFieldErrors(record.errors)
    ?? (nestedError && typeof nestedError === 'object' ? toFieldErrors((nestedError as Record<string, unknown>).errors) : undefined)
    ?? toFieldErrors(record.details);
}

export function getFieldError(fieldErrors: FieldErrors | undefined, ...keys: string[]): string | undefined {
  if (!fieldErrors) {
    return undefined;
  }

  for (const key of keys) {
    const value = fieldErrors[key];
    if (value) {
      return value;
    }
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as ApiLikeError).message === 'string') {
    return (error as ApiLikeError).message as string;
  }

  return fallback;
}

export function getApiFieldErrors(error: unknown): FieldErrors | undefined {
  if (error && typeof error === 'object' && 'fieldErrors' in error) {
    return (error as ApiLikeError).fieldErrors;
  }

  return undefined;
}
