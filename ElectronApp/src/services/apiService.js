import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';


class APIService {
  static async postActivity(payload) {
    try {
      // console.log('📤 Sending payload to:', `${API_BASE_URL}/activity`);
      const response = await axios.post(`${API_BASE_URL}/activity`, payload);
      return response.data;
      
    } catch (error) {
      // console.error('Activity post error:', error.message);
      // console.error('Full URL:', error.config?.url);
      // console.error('Response:', error.response?.data);
      throw error;
    }
  }

  static async postScreenshot(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/screenshot`, payload);
      return response.data;
    } catch (error) {
      console.error('Screenshot post error:', error.message);
      throw error;
    }
  }

  static async getStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      return response.data;
    } catch (error) {
      console.error('Status fetch error:', error.message);
      throw error;
    }
  }
}

export default APIService;
