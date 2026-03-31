import { adminApi, cleanParams, retryApiRequest } from './http.js';

export const getSecurityAlerts = async (params = {}) => {
  const response = await retryApiRequest(
    () =>
      adminApi.get('/security-alerts', {
        params: cleanParams(params)
      }),
    { attempts: 2, delayMs: 300 }
  );

  return response.data.data;
};

export const acknowledgeSecurityAlert = async (alertId) => {
  const response = await adminApi.post(`/security-alerts/${alertId}/acknowledge`);
  return response.data.data;
};
