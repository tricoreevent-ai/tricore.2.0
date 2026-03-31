import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const resolveApiOrigin = (env) => {
  if (env.VITE_API_ORIGIN) {
    return trimTrailingSlash(env.VITE_API_ORIGIN);
  }

  if (env.VITE_API_URL) {
    try {
      return new URL(env.VITE_API_URL).origin;
    } catch {
      // Ignore relative API URLs and fall back to host/port-based resolution.
    }
  }

  const protocol = env.VITE_API_PROTOCOL || 'http';
  const host = env.VITE_API_HOST || 'localhost';
  const port = env.VITE_API_PORT || '5000';

  return `${protocol}://${host}:${port}`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiOrigin = resolveApiOrigin(env);
  const proxy = {
    '/api': {
      target: apiOrigin,
      changeOrigin: true
    },
    '/uploads': {
      target: apiOrigin,
      changeOrigin: true
    }
  };

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy
    },
    preview: {
      host: true,
      port: 4173,
      proxy
    }
  };
});
