import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Định nghĩa kiểu cho một tin nhắn trong lịch sử chat
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

/**
 * Đọc nội dung từ tệp system_prompt.txt
 * @returns Nội dung prompt hệ thống
 */
const getSystemPrompt = (): string => {
  const promptPath = path.join(__dirname, '../config/system_prompt.txt');
  try {
    return fs.readFileSync(promptPath, 'utf-8').trim();
  } catch (error) {
    console.error('❌ Lỗi khi đọc system_prompt.txt:', error);
    return 'You are a helpful AI assistant.'; // Prompt mặc định nếu không đọc được tệp
  }
};

/**
 * Gửi lịch sử chat đến Ollama và nhận phản hồi.
 * @param messages Lịch sử các tin nhắn (bao gồm tin nhắn mới nhất của người dùng).
 * @returns Phản hồi từ mô hình AI.
 */
export const getOllamaChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Đọc prompt hệ thống
    const systemPrompt = getSystemPrompt();

    // Thêm prompt hệ thống vào lịch sử tin nhắn
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log(`Sending request to Ollama (${OLLAMA_MODEL}) at ${OLLAMA_URL}/api/chat with messages:`, JSON.stringify(fullMessages, null, 2));

    // Gửi yêu cầu đến API Ollama
    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: OLLAMA_MODEL,
      messages: fullMessages,
      stream: false // Giữ stream: false để nhận phản hồi hoàn chỉnh
    });

    console.log('Received response from Ollama:', JSON.stringify(response.data, null, 2));

    // Phản hồi từ /api/chat thường nằm trong response.data.message.content
    if (response.data && response.data.message && response.data.message.content) {
      return response.data.message.content
        .replace(/<think>|<\/think>/g, '') // Loại bỏ thẻ <think> nếu có
        .replace(/oxed\{(.*?)\}/g, '$1') // Loại bỏ oxed{} nếu có
        .trim();
    } else {
      console.error('❌ Phản hồi từ Ollama không có cấu trúc mong đợi:', response.data);
      return 'Không nhận được phản hồi hợp lệ từ mô hình AI.';
    }
  } catch (err: any) {
    console.error('❌ Lỗi gọi Ollama (/api/chat):', err.response ? err.response.data : err.message);
    return 'Không thể kết nối hoặc xử lý yêu cầu với mô hình AI.';
  }
};