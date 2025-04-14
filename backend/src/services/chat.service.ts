import { getOllamaChatResponse } from '../utils/ollama';
import { Message, IMessage } from '../models/message.model';

// Định nghĩa kiểu cho một tin nhắn trong lịch sử chat gửi đến Ollama
interface OllamaChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Hàm chuyển đổi từ IMessage (MongoDB) sang OllamaChatMessage
const formatMessageForOllama = (msg: IMessage): OllamaChatMessage => {
    return {
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
    };
};

/**
 * Xử lý tin nhắn từ người dùng và trả về phản hồi từ mô hình AI.
 * @param text Tin nhắn từ người dùng.
 * @returns Phản hồi từ mô hình AI.
 */
export const handleMessage = async (text: string): Promise<string> => {
    try {
        // 1. Lưu tin nhắn người dùng vào MongoDB
        const userMsg = new Message({ text, type: 'user' });
        await userMsg.save();

        // 2. Lấy lịch sử trò chuyện gần đây từ MongoDB
        const historyMessages = await Message.find()
            .sort({ timestamp: -1 })
            .limit(10) // Lấy 10 tin nhắn cuối cùng (5 cặp user-bot)
            .exec();

        // Đảo ngược thứ tự để có lịch sử từ cũ đến mới
        historyMessages.reverse();

        // 3. Định dạng lịch sử cho Ollama
        const ollamaHistory: OllamaChatMessage[] = historyMessages.map(formatMessageForOllama);

        // 4. Gọi mô hình DeepSeek qua Ollama với lịch sử
        const botText = await getOllamaChatResponse(ollamaHistory);

        // 5. Lưu phản hồi từ bot vào MongoDB
        const botMsg = new Message({ text: botText, type: 'bot' });
        await botMsg.save();

        // 6. Trả về phản hồi của bot
        return botText;
    } catch (error) {
        console.error('Error in handleMessage:', error);
        throw new Error('Failed to process user message');
    }
};

/**
 * Xử lý nội dung file được tải lên và trả về phản hồi từ mô hình AI.
 * @param content Nội dung file.
 * @returns Phản hồi từ mô hình AI.
 */
export const handleFile = async (content: string): Promise<string> => {
    try {
        // Tạo prompt cho Ollama để phân tích file
        const promptForFile: OllamaChatMessage[] = [
            { role: 'user', content: `Analyze the following file content and provide a summary or key insights:\n\n${content}` }
        ];

        // Gọi Ollama để xử lý nội dung file
        const response = await getOllamaChatResponse(promptForFile);

        // Lưu phản hồi của bot vào MongoDB
        const botMessage = new Message({ text: response, type: 'bot' });
        await botMessage.save();

        return response;
    } catch (error) {
        console.error('Error in handleFile:', error);
        throw new Error('Failed to process file with Ollama');
    }
};

/**
 * Lấy lịch sử tin nhắn từ MongoDB.
 * @returns Danh sách tin nhắn từ MongoDB.
 */
export const getHistory = async (): Promise<IMessage[]> => {
    try {
        // Lấy tối đa 100 tin nhắn, sắp xếp theo thời gian tăng dần
        return await Message.find().sort({ timestamp: 1 }).limit(100);
    } catch (error) {
        console.error('Error in getHistory:', error);
        throw new Error('Failed to fetch message history');
    }
};