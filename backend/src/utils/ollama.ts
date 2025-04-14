import axios from 'axios';

// Định nghĩa kiểu cho một tin nhắn trong lịch sử chat
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'; // Thêm 'system' nếu cần thiết
  content: string;
}

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b'; // Đảm bảo đây là model bạn muốn dùng

/**
 * Gửi lịch sử chat đến Ollama và nhận phản hồi.
 * @param messages Lịch sử các tin nhắn (bao gồm tin nhắn mới nhất của người dùng).
 * @returns Phản hồi từ mô hình AI.
 */
export const getOllamaChatResponse = async (messages: ChatMessage[]): Promise<string> => {
    try {
        console.log(`Sending request to Ollama (${OLLAMA_MODEL}) at ${OLLAMA_URL}/api/chat with messages:`, JSON.stringify(messages, null, 2));
        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            model: OLLAMA_MODEL,
            messages: messages, // Gửi toàn bộ lịch sử
            stream: false // Giữ stream: false để nhận phản hồi hoàn chỉnh
        });
        console.log('Received response from Ollama:', JSON.stringify(response.data, null, 2));

        // Phản hồi từ /api/chat thường nằm trong response.data.message.content
        if (response.data && response.data.message && response.data.message.content) {
            // Có thể cần xử lý thêm response.data.message.content nếu nó chứa các ký tự đặc biệt
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

// Giữ lại hàm cũ nếu cần hoặc xóa đi
// export const getOllamaResponse = async (prompt: string): Promise<string> => { ... };
