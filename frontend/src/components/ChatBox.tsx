import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const data = await sendMessage(message);
    setResponse(data.botReply);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat with DeepSeek</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSendMessage}>Send</button>
      {response && (
        <div>
          <h3>Bot Reply:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;