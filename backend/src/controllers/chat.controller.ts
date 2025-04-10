import { Request, Response } from 'express';
import fs from 'fs';
import { handleMessage, handleFile, getHistory } from '../services/chat.service';

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        const reply = await handleMessage(message);
        res.json({
            success: true,
            userMessage: message,
            botReply: reply
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).json({ error: 'File is required' });
            return;
        }
        const content = fs.readFileSync(req.file.path, 'utf8');
        fs.unlinkSync(req.file.path); // Delete file after reading
        const reply = await handleFile(content);
        res.json({ reply });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const trendModel = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file || !req.file.path) {
            res.status(400).json({ error: 'File is required' });
            return;
        }
        const content = fs.readFileSync(req.file.path, 'utf8');
        fs.unlinkSync(req.file.path); // Delete file after reading

        // Logic to trend the model with the uploaded file
        const reply = await handleFile(content); // Reuse handleFile for processing
        res.json({
            message: 'Model is trending with new data!',
            reply,
        });
    } catch (error) {
        console.error('Error in trendModel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const fetchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const messages = await getHistory(); // Gọi hàm lấy dữ liệu từ MongoDB
        res.json(messages); // Trả về dữ liệu dưới dạng JSON
    } catch (error) {
        console.error('Error in fetchHistory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};