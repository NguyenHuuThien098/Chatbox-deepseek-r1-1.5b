import { Request, Response } from 'express';
import fs from 'fs/promises'; // Sử dụng fs/promises để xử lý file không đồng bộ
import { handleMessage, handleFile, getHistory } from '../services/chat.service';

/**
 * Xử lý tin nhắn từ người dùng và trả về phản hồi từ mô hình AI.
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        console.time('sendMessage'); // Đo thời gian xử lý
        const reply = await handleMessage(message);
        console.timeEnd('sendMessage');

        res.json({
            success: true,
            userMessage: message,
            botReply: reply,
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Xử lý file được tải lên và trả về phản hồi từ mô hình AI.
 */
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).json({ error: 'File is required' });
            return;
        }

        console.time('uploadFile'); // Đo thời gian xử lý
        const content = await fs.readFile(req.file.path, 'utf8');
        await fs.unlink(req.file.path); // Xóa file sau khi đọc

        const reply = await handleFile(content);
        console.timeEnd('uploadFile');

        res.json({ success: true, reply });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Huấn luyện (trend) mô hình với dữ liệu mới từ file tải lên.
 */
export const trendModel = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).json({ error: 'File is required' });
            return;
        }

        console.time('trendModel'); // Đo thời gian xử lý
        const content = await fs.readFile(req.file.path, 'utf8');
        await fs.unlink(req.file.path); // Xóa file sau khi đọc

        // Logic huấn luyện mô hình với dữ liệu mới
        const reply = await handleFile(content); // Tạm thời tái sử dụng `handleFile` để xử lý
        console.timeEnd('trendModel');

        res.json({
            success: true,
            message: 'Model is trending with new data!',
            reply,
        });
    } catch (error) {
        console.error('Error in trendModel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Lấy lịch sử tin nhắn từ MongoDB.
 */
export const fetchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        console.time('fetchHistory'); // Đo thời gian xử lý
        const messages = await getHistory();
        console.timeEnd('fetchHistory');

        res.json({ success: true, messages }); // Trả về lịch sử tin nhắn dưới dạng JSON
    } catch (error) {
        console.error('Error in fetchHistory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};