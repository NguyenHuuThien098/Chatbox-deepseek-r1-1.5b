import React from 'react';
import ChatBox from './components/ChatBox';
import FileUploader from './components/FileUploader';
import MessageHistory from './components/MessageHistory';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>DeepSeek Chatbox</h1>
      <ChatBox />
      <FileUploader />
      <MessageHistory />
    </div>
  );
};

export default App;
