import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const sendMessage = async (message: string) => {
  const response = await axios.post(`${API_URL}/message`, { message });
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const fetchHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data;
};