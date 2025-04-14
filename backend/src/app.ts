import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:8080', // Cho phép frontend truy cập
  methods: ['GET', 'POST'], // Các phương thức được phép
  credentials: true // Cho phép gửi cookie nếu cần
}));

app.use(express.json());
app.use('/api', chatRoutes);

export default app;