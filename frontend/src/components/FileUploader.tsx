import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import '../styles/FileUploader.css';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setResponse('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadFile(file); // Gửi file lên backend
      setResponse(data.message || 'File uploaded successfully!');
    } catch (error) {
      setResponse('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileChange}
        className="file-input"
        disabled={isUploading}
      />
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
      {response && <p className="upload-response">{response}</p>}
    </div>
  );
};

export default FileUploader;