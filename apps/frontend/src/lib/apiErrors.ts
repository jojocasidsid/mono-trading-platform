import axios from 'axios';

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { toast } from 'sonner';

import type { ApiErrorDetail, ApiErrorResponse } from '@/types/api';

export function getApiErrors(error: unknown): ApiErrorDetail[] {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return [];
  }

  return error.response?.data?.errors ?? [];
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong.'
): string {
  const errors = getApiErrors(error);

  if (errors.length > 0) {
    return errors[0]!.message;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect to the server.';
    }

    if (error.response.status >= 500) {
      return 'An unexpected server error occurred.';
    }
  }

  return fallbackMessage;
}

interface ApplyApiErrorsOptions<T extends FieldValues> {
  error: unknown;
  setError: UseFormSetError<T>;

  fieldMap?: Record<string, Path<T>>;

  fallbackMessage?: string;
}

export function applyApiErrors<T extends FieldValues>({
  error,
  setError,
  fieldMap = {},
  fallbackMessage = 'Something went wrong.',
}: ApplyApiErrorsOptions<T>): void {
  const errors = getApiErrors(error);

  if (errors.length === 0) {
    toast.error(getApiErrorMessage(error, fallbackMessage));

    return;
  }

  const generalErrors: string[] = [];

  for (const apiError of errors) {
    if (!apiError.pointer) {
      generalErrors.push(apiError.message);

      continue;
    }

    const field = fieldMap[apiError.pointer] ?? (apiError.pointer as Path<T>);

    setError(field, {
      type: 'server',
      message: apiError.message,
    });
  }

  if (generalErrors.length > 0) {
    toast.error(generalErrors[0]);
  }
}
