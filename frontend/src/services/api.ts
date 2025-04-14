import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api'; // Assuming backend is proxied or served from /api

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
    const response = await axios.get<{ history: Message[] }>(`${API_URL}/chat/history`);
    // Ensure history is always an array, even if API returns null/undefined
    return response.data.history || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return []; // Return empty array on error
  }
};

// Sends a user message to the backend
export const sendMessage = async (text: string): Promise<Message | null> => {
  try {
    // The backend sendMessage controller currently returns the bot's response text directly.
    // We'll wrap it in a Message object for consistency on the frontend.
    const response = await axios.post<{ botResponse: string }>(`${API_URL}/chat/message`, { text });
    return { text: response.data.botResponse, type: 'bot' };
  } catch (error) {
    console.error('Error sending message:', error);
    return null; // Indicate error
  }
};

// Uploads a file to the backend
export const uploadFile = async (file: File): Promise<any> => { // Adjust return type as needed based on backend response
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/chat/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw error to be handled by the caller
  }
};

// Sends a file for trend model processing
export const trendModel = async (file: File): Promise<any> => { // Adjust return type as needed
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/chat/trend`, formData, {
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
