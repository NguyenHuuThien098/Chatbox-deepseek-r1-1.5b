import React, { useState, useEffect, useCallback } from 'react';
import { Message, fetchHistory, sendMessage } from './services/api';
import MessageHistory from './components/MessageHistory';
import ChatInput from './components/ChatInput'; // Renamed from ChatBox for clarity
// Removed FileUploader import for now, will integrate later if needed
import './App.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial chat history
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const history = await fetchHistory();
        setMessages(history);
      } catch (err) {
        setError('Failed to load chat history.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Handle sending a new message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { text, type: 'user', createdAt: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botMessage = await sendMessage(text);
      if (botMessage) {
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        setError('Failed to get response from bot.');
        // Optionally remove the user message or add an error message to the chat
      }
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
      // Optionally remove the user message or add an error message to the chat
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Placeholder for top bar elements like "ChatGPT 4o" dropdown if needed */}
      </header>
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        <div className="chat-container">
          <MessageHistory messages={messages} isLoading={isLoading && messages.length === 0} />
          {/* Placeholder text similar to the image */}
          {messages.length === 0 && !isLoading && (
            <div className="welcome-message">What's on your mind today?</div>
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
      <footer className="App-footer">
        {/* Placeholder for footer elements if needed */}
      </footer>
    </div>
  );
}

export default App;
