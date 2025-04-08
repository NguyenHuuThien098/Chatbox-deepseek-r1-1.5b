import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  type: string; // 'user' hoặc 'bot'
  timestamp: Date;
}

const MessageSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);