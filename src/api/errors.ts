export type FieldErrors = Record<string, string>;

export function extractFieldErrors(payload: unknown): FieldErrors | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const rawError = record.error;

  if (!rawError || typeof rawError !== 'object' || Array.isArray(rawError)) {
    return undefined;
  }

  const source = rawError as Record<string, unknown>;
  const entries = Object.entries(source).filter(([key, value]) => {
    if (typeof value !== 'string') {
      return false;
    }

    return key !== 'code' && key !== 'message';
  });

  if (!entries.length) {
    return undefined;
  }

  return entries.reduce<FieldErrors>((accumulator, [key, value]) => {
    accumulator[key] = value as string;
    return accumulator;
  }, {});
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
