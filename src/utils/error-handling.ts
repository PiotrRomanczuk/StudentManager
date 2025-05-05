import { APIError } from './api-helpers';

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export function createError(message: string, code?: string, status?: number): Error {
  if (status) {
    return new APIError(message, status, code);
  }
  return new Error(message);
}

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

export function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: Error) => void
): AsyncResult<T> {
  return fn()
    .then((data) => ({ success: true as const, data }))
    .catch((error) => {
      const handledError = handleError(error);
      errorHandler?.(handledError);
      return { success: false as const, error: handledError };
    });
}

export function unwrapResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
} 