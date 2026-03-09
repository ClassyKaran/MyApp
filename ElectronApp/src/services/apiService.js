import axios from "axios";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

export const postActivity = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/activity`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postScreenshot = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/screenshot`, payload);
    return response.data;
  } catch (error) {
    console.error("Screenshot post error:", error.message);
    throw error;
  }
};

export const getStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Status fetch error:", error.message);
    throw error;
  }
};