import React, { useState } from 'react';
import { sendMessage } from '../services/api';
// import './ChatBox.css';
// filepath: f:\deepseek-chatbox\frontend\src\components\ChatBox.tsx
import '../styles/ChatBox.css';
const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: message, isBot: false },
    ]);

    setIsThinking(true);
    setMessage('');

    // Send message to the server and get response
    const data = await sendMessage(message);
    setMessages((prev) => [
      ...prev,
      { type: 'bot', text: data.botReply, isBot: true },
    ]);
    setIsThinking(false);
  };

  return (
    <div className="chatbox">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isBot ? 'bot' : 'user'}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        {isThinking && <div className="thinking">Bot is typing...</div>}
      </div>

      <div className="input-area">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
