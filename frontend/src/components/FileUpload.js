import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

function FileUpload({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Please upload a CSV file' });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    const result = await onUpload(file);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFile(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
          disabled={loading}
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload
            className={`mb-4 ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
            size={48}
          />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {file ? file.name : 'Drop your CSV file here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse (CSV files only)
          </p>
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Processing...' : '🚀 Upload & Analyze'}</span>
        </button>
      )}

      {message && (
        <div
          className={`flex items-center space-x-2 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">CSV Format Example:</h4>
        <div className="text-sm text-blue-800 font-mono bg-white p-3 rounded overflow-x-auto">
          <div>Date,Description,Amount,Mode</div>
          <div>2025-10-01,Zomato - Lunch,350,UPI</div>
          <div>2025-10-03,Uber,220,Card</div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
