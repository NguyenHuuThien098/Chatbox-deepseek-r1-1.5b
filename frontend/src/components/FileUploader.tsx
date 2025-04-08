import React, { useState } from 'react';
import { uploadFile } from '../services/api';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const data = await uploadFile(file);
    setResponse(data.reply);
    setFile(null);
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {response && (
        <div>
          <h3>Analysis Result:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;