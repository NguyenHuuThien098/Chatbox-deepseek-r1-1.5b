import express from 'express';
import multer from 'multer';
import { sendMessage, uploadFile, fetchHistory } from '../controllers/chat.controller';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file: 5MB
});

// Route để gửi tin nhắn
router.post('/message', sendMessage);

// Route để tải lên file
router.post('/upload', upload.single('file'), uploadFile);

// Route để lấy lịch sử tin nhắn
router.get('/history', fetchHistory);

export default router;