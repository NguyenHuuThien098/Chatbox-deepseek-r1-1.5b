import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../services/api';

const MessageHistory: React.FC = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      const data = await fetchHistory();
      setHistory(data);
    };
    getHistory();
  }, []);

  return (
    <div>
      <h2>Message History</h2>
      <ul>
        {history.map((msg: any, index) => (
          <li key={index}>
            <strong>{msg.type === 'user' ? 'User' : 'Bot'}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageHistory;