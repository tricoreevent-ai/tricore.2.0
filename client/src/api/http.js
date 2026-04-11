import axios from 'axios';
import {
  ADMIN_TOKEN_KEY,
  AUTH_EXPIRED_EVENT,
  PUBLIC_TOKEN_KEY
} from '../utils/authKeys.js';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');
const buildApiUrl = (origin) => `${trimTrailingSlash(origin)}/api`;

const resolveBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return trimTrailingSlash(import.meta.env.VITE_API_URL);
  }

  if (typeof window !== 'undefined') {
    return '/api';
  }

  if (import.meta.env.VITE_API_ORIGIN) {
    return buildApiUrl(import.meta.env.VITE_API_ORIGIN);
  }

  return 'http://localhost:5000/api';
};

const baseURL = resolveBaseURL();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableApiError = (error) => {
  const status = error?.response?.status;

  if (!status) {
    return true;
  }

  return status >= 500 && status < 600;
};

export const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );

export const retryApiRequest = async (request, { attempts = 3, delayMs = 350 } = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isRetryableApiError(error)) {
        throw error;
      }

      await sleep(delayMs * attempt);
    }
  }

  throw lastError;
};

const createApiClient = (tokenKey) => {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem(tokenKey);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(AUTH_EXPIRED_EVENT, {
              detail: { tokenKey }
            })
          );
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const publicApi = createApiClient(PUBLIC_TOKEN_KEY);
export const adminApi = createApiClient(ADMIN_TOKEN_KEY);
