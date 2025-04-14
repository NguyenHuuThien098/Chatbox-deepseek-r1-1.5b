import { getOllamaChatResponse } from '../utils/ollama'; // Đổi tên hàm import
import { Message, IMessage } from '../models/message.model';
import fs from 'fs'; // Import fs để xử lý file

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

export const handleMessage = async (text: string): Promise<string> => {
    // 1. Lưu tin nhắn người dùng vào MongoDB
    const userMsg = new Message({ text, type: 'user' });
    await userMsg.save();

    // 2. Lấy lịch sử trò chuyện gần đây từ MongoDB
    // Lấy 10 tin nhắn cuối cùng (5 cặp user-bot) để làm ngữ cảnh
    // Bạn có thể điều chỉnh số lượng này
    const historyMessages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .exec();

    // Đảo ngược lại để có thứ tự thời gian đúng (cũ nhất trước)
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
};

export const handleFile = async (content: string): Promise<string> => {
    try {
        // Tạo prompt cho Ollama để phân tích file
        const promptForFile: OllamaChatMessage[] = [
            { role: 'user', content: `Analyze the following file content and provide a summary or key insights:

${content}` }
        ];

        // Gọi Ollama để xử lý nội dung file
        const response = await getOllamaChatResponse(promptForFile);

        // Lưu phản hồi của bot vào MongoDB (có thể tùy chỉnh type nếu cần)
        const botMessage = new Message({ text: response, type: 'bot' }); // Giữ type là 'bot'
        await botMessage.save();
        return response;
    } catch (error) {
        console.error('Error in handleFile:', error);
        throw new Error('Failed to process file with Ollama');
    }
};

export const getHistory = async () => {
    // Có thể tăng giới hạn nếu cần hiển thị nhiều hơn trên frontend
    return await Message.find().sort({ timestamp: 1 }).limit(100);
};
