import React, { useRef, useEffect } from 'react';
import { Message } from '../services/api';
import '../styles/MessageHistory.css'; // Ensure CSS path is correct

interface MessageHistoryProps {
  messages: Message[];
  isLoading: boolean; // To show initial loading state
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return <div className="loading-history">Loading history...</div>;
  }

  // Don't render the component if there are no messages and it's not loading
  // The parent component (App.tsx) will handle showing the initial welcome message.
  if (messages.length === 0) {
      return null;
  }

  return (
    <div className="message-history">
      {messages.map((msg, index) => (
        <div key={msg._id || index} className={`message-item message-${msg.type}`}>
          <div className="message-content">
            {/* Basic text rendering, can be enhanced for markdown, code blocks etc. */}
            <p>{msg.text}</p>
          </div>
          {/* Optional: Add timestamp or sender info here */}
        </div>
      ))}
      {/* Dummy div to help scroll to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageHistory;
