import apiClient from './client';

export const employeeApi = {
  getAll: () => apiClient.get('/employees').then(res => res.data),
  getSummary: (hostname) => apiClient.get(`/employee/${hostname}/summary`).then(res => res.data),
};

export const screenshotApi = {
  getByHostname: (hostname, limit = 20) => 
    apiClient.get(`/screenshots/${hostname}?limit=${limit}`).then(res => res.data),
  getByHostnameOffset: (hostname, offset = 0, limit = 20) => 
    apiClient.get(`/screenshots/${hostname}?offset=${offset}&limit=${limit}`).then(res => res.data),
};
