import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

export const getOllamaResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt,
            stream: false
        });
        // Loại bỏ các thẻ không cần thiết và ký tự đặc biệt
        return response.data.response
            .replace(/<think>|<\/think>/g, '') // Loại bỏ thẻ <think>
            .replace(/\\boxed\{(.*?)\}/g, '$1') // Loại bỏ \\boxed{}
            .trim();
    } catch (err: any) {
        console.error('❌ Lỗi gọi Ollama:', err.message);
        return 'Không thể kết nối đến mô hình AI.';
    }
};