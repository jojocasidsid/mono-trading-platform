import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL is required');
}

export const apiClient = axios.create({
  baseURL: apiUrl,

  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post(
      `${apiUrl}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    )
    .then(() => undefined);

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

apiClient.interceptors.response.use(
  response => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();

      return apiClient(originalRequest);
    } catch {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  }
);
