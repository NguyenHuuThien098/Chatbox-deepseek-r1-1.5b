import React, { useState, useEffect, useCallback } from 'react';
import { Message, fetchHistory, sendMessage } from './services/api';
import MessageHistory from './components/MessageHistory';
import ChatInput from './components/ChatInput';
import FileUploader from './components/FileUploader';
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
        console.error('Error fetching chat history:', err);
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
      const botReply = await sendMessage(text); // botReply là chuỗi
      if (botReply) {
        const botMessage: Message = { text: botReply, type: 'bot', createdAt: new Date() }; // Tạo đối tượng Message
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        setError('Failed to get response from bot.');
      }
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>DeepSeek Chatbox</h1>
      </header>
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        <div className="chat-container">
          <MessageHistory messages={messages} isLoading={isLoading && messages.length === 0} />
          {messages.length === 0 && !isLoading && (
            <div className="welcome-message">What's on your mind today?</div>
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <FileUploader />
        </div>
      </main>
      <footer className="App-footer">
        <p>Powered by DeepSeek</p>
      </footer>
    </div>
  );
}

export default App;