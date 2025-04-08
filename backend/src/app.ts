import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

export default app;
