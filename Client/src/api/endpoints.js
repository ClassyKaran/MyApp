import axios from 'axios';
import { toast } from 'react-toastify';

export const config = {
  apiBaseUrl:import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
};


const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);


export const employeeApi = {
  getAll: () => apiClient.get('/employees').then(res => res.data),
  getSummary: (hostname) => apiClient.get(`/employee/${hostname}/summary`).then(res => res.data),
};

export const screenshotApi = {
  getAll: (limit = 100) =>
    apiClient.get(`/screenshots?limit=${limit}`).then(res => res.data),
  getByHostname: (hostname, limit = 20) =>
    apiClient.get(`/screenshots/${hostname}?limit=${limit}`).then(res => res.data),
  getByHostnameOffset: (hostname, offset = 0, limit = 20) =>
    apiClient.get(`/screenshots/${hostname}?offset=${offset}&limit=${limit}`).then(res => res.data),
};

export const liveScreenApi = {
  request: (hostname) => 
    apiClient.post('/live-screen/request', { hostname }).then(res => res.data),
  stop: () => 
    apiClient.post('/live-screen/stop').then(res => res.data),
};

export const attendanceApi = {
  calculate: (startDate, endDate) => 
    apiClient.post('/attendance/calculate', { startDate, endDate }).then(res => res.data),
  get: (startDate, endDate) => 
    apiClient.get(`/attendance?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),
  exportCSV: (startDate, endDate) => 
    apiClient.get(`/attendance/export?startDate=${startDate}&endDate=${endDate}`, { responseType: 'blob' }),
};

export default apiClient;
