import { API_CONFIG } from './config';
import type { ApiResponse } from '../types';

/**
 * Request GET ke Apps Script.
 */
export async function apiGet<T>(
  action: string,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = new URL(API_CONFIG.BASE_URL);
  url.searchParams.set('action', action);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
    });

    const json = (await response.json()) as ApiResponse<T>;
    return json;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.name === 'AbortError'
          ? 'Request timeout. Periksa koneksi internet Anda.'
          : 'Gagal menghubungi server. Periksa koneksi internet.',
      data: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Request POST ke Apps Script.
 */
export async function apiPost<T>(
  action: string,
  payload?: unknown,
  id?: string
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action,
        payload: payload ?? {},
        id: id ?? '',
      }),
      signal: controller.signal,
    });

    const json = (await response.json()) as ApiResponse<T>;
    return json;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.name === 'AbortError'
          ? 'Request timeout. Periksa koneksi internet Anda.'
          : 'Gagal menghubungi server. Periksa koneksi internet.',
      data: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}