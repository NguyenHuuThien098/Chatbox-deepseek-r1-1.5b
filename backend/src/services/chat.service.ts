import { getOllamaResponse } from '../utils/ollama';
import { Message } from '../models/message.model';

export const handleMessage = async (text: string) => {
    // Lưu tin nhắn người dùng vào MongoDB
    const userMsg = new Message({ text, type: 'user' });
    await userMsg.save();
  
    // Gọi mô hình DeepSeek qua Ollama để lấy phản hồi
    const botText = await getOllamaResponse(text);
  
    // Lưu phản hồi từ bot vào MongoDB
    const botMsg = new Message({ text: botText, type: 'bot' });
    await botMsg.save();
  
    // Trả về phản hồi của bot
    return botText;
  };
  

export const handleFile = async (content: string): Promise<string> => {
  try {
    const response = await getOllamaResponse(`Analyze the following file content:\n${content}`);
    const botMessage = new Message({ text: response, type: 'bot' });
    await botMessage.save();
    return response;
  } catch (error) {
    console.error('Error in handleFile:', error);
    throw new Error('Failed to process file');
  }
};

export const getHistory = async () => {
  return await Message.find().sort({ timestamp: 1 }).limit(100);
};