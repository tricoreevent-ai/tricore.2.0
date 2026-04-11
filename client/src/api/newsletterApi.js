import { adminApi, cleanParams, publicApi } from './http.js';

const freshRequestConfig = (params = {}) => ({
  params: {
    ...cleanParams(params),
    _ts: Date.now()
  },
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  }
});

export const getPublicNewsletters = async (params = {}) => {
  const response = await publicApi.get('/newsletters', freshRequestConfig(params));
  return response.data.data;
};

export const getPublicNewsletterBySlug = async (slug) => {
  const response = await publicApi.get(`/newsletters/${slug}`, freshRequestConfig());
  return response.data.data;
};

export const getAdminNewsletterCatalog = async () => {
  const response = await adminApi.get('/newsletters/admin', freshRequestConfig());
  return response.data.data;
};

export const getAdminNewsletterById = async (newsletterId) => {
  const response = await adminApi.get(`/newsletters/admin/${newsletterId}`, freshRequestConfig());
  return response.data.data;
};

export const createNewsletter = async (payload) => {
  const response = await adminApi.post('/newsletters', payload);
  return response.data.data;
};

export const updateNewsletter = async (newsletterId, payload) => {
  const response = await adminApi.put(`/newsletters/${newsletterId}`, payload);
  return response.data.data;
};

export const deleteNewsletter = async (newsletterId) => {
  const response = await adminApi.delete(`/newsletters/${newsletterId}`);
  return response.data;
};

export const getAdminNewsletterCategories = async () => {
  const response = await adminApi.get('/newsletters/admin/categories', freshRequestConfig());
  return response.data.data;
};

export const createNewsletterCategory = async (payload) => {
  const response = await adminApi.post('/newsletters/admin/categories', payload);
  return response.data.data;
};

export const updateNewsletterCategory = async (categoryId, payload) => {
  const response = await adminApi.put(`/newsletters/admin/categories/${categoryId}`, payload);
  return response.data.data;
};

export const deleteNewsletterCategory = async (categoryId) => {
  const response = await adminApi.delete(`/newsletters/admin/categories/${categoryId}`);
  return response.data;
};
