import React, { useState, useCallback } from 'react';
import '../styles/ChatInput.css'; // Ensure CSS path is correct

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    // Auto-resize textarea (optional)
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = useCallback((event?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event) event.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Reset textarea height after sending (optional)
      const textarea = document.getElementById('chat-textarea') as HTMLTextAreaElement;
      if (textarea) {
          textarea.style.height = 'auto';
      }
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (new line)
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="input-container">
        {/* Placeholder for potential attachment (+) button */}
        {/* <button type="button" className="icon-button attachment-button">+</button> */}
        <textarea
          id="chat-textarea" // Added id for potential height reset
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything" // Changed placeholder
          rows={1} // Start with one row
          disabled={isLoading}
          className="chat-textarea"
        />
        {/* Placeholder for microphone button */}
        {/* <button type="button" className="icon-button mic-button">🎤</button> */}
        <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-button">
          {isLoading ? '...' : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      {/* Placeholder for buttons below the input (Search, Deep research, ...) */}
      {/* <div className="input-actions">
        <button type="button">Search</button>
        <button type="button">Deep research</button>
        <button type="button">...</button>
      </div> */}
    </form>
  );
};

export default ChatInput;
