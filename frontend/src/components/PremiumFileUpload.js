import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

export function PremiumFileUpload({ onFileSelect, acceptedFiles = '.csv', maxSize = 5 }) {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

  const handleFile = (uploadedFile) => {
    setError('');
    
    // Validate file size
    if (uploadedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const fileExtension = '.' + uploadedFile.name.split('.').pop();
    if (!acceptedFiles.includes(fileExtension)) {
      setError(`Only ${acceptedFiles} files are accepted`);
      return;
    }

    setFile(uploadedFile);
    if (onFileSelect) {
      onFileSelect(uploadedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="space-y-4">
      <form
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
        className="relative"
      >
        <input
          type="file"
          accept={acceptedFiles}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className={`
            relative block
            glass-card
            border-2 border-dashed
            rounded-2xl p-12
            cursor-pointer
            transition-all duration-300
            hover:border-indigo-500/50
            ${dragActive ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-slate-700/50'}
            ${error ? 'border-rose-500/50' : ''}
          `}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ 
                scale: dragActive ? 1.1 : 1,
                rotate: dragActive ? 5 : 0 
              }}
              className={`
                p-6 rounded-2xl
                bg-gradient-to-br from-indigo-600/20 to-purple-600/20
                border border-indigo-500/20
                ${dragActive ? 'shadow-lg shadow-indigo-500/30' : ''}
              `}
            >
              <Upload 
                size={48} 
                className={`
                  transition-colors duration-300
                  ${dragActive ? 'text-indigo-400' : 'text-slate-400'}
                `}
              />
            </motion.div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {dragActive ? 'Drop your file here' : 'Upload your file'}
              </h3>
              <p className="text-sm text-slate-400">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-slate-500">
                Accepted: {acceptedFiles} • Max size: {maxSize}MB
              </p>
            </div>
          </motion.div>

          {/* Animated gradient border on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
        </label>
      </form>

      {/* File Preview */}
      {file && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 rounded-xl border border-emerald-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-600/20 border border-emerald-500/30">
                <FileText className="text-emerald-400" size={24} />
              </div>
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-400" size={20} />
              <button
                onClick={removeFile}
                className="p-2 rounded-lg hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl border border-rose-500/30 bg-rose-600/10"
        >
          <p className="text-sm text-rose-400">{error}</p>
        </motion.div>
      )}
    </div>
  );
}

export default PremiumFileUpload;
