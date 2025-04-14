import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Interface for message objects
export interface Message {
  _id?: string; // Optional ID from MongoDB
  text: string;
  type: 'user' | 'bot';
  createdAt?: Date; // Optional timestamp
}

// Fetches the chat history
export const fetchHistory = async (): Promise<Message[]> => {
  try {
    const response = await axios.get<Message[]>(`${API_URL}/history`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Sends a user message to the backend
export const sendMessage = async (text: string): Promise<string> => {
  try {
      const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
      const response = await axios.post(
          `${API_URL}/message`,
          { message: text },
          {
              headers: {
                  Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
              },
          }
      );
      return response.data.botReply; // Trả về phản hồi từ bot
  } catch (error) {
      console.error('Error sending message:', error);
      throw error;
  }
}; 

// Uploads a file to the backend
export const uploadFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Sends a file for trend model processing
export const trendModel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/trend`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error trending model:', error);
    throw error;
  }
};