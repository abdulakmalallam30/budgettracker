import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Activity, Trash2, Database, RefreshCw } from 'lucide-react';

function FileUpload({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [currentData, setCurrentData] = useState({ expenses: [], totalExpenses: 0 });
  const [clearingData, setClearingData] = useState(false);

  // Fetch current data status on component mount
  useEffect(() => {
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    try {
      console.log('📊 Fetching current data...');
      const response = await fetch('http://localhost:5000/api/expenses');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Current data fetched:', data);
        setCurrentData({
          expenses: data.expenses || [],
          totalExpenses: data.totalExpenses || data.expenses?.length || 0,
          analytics: data.analytics
        });
      } else {
        console.warn('⚠️ Failed to fetch current data:', response.status);
        setCurrentData({ expenses: [], totalExpenses: 0 });
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch current data:', error.message);
      setCurrentData({ expenses: [], totalExpenses: 0 });
    }
  };

  const handleClearData = async () => {
    if (!window.confirm(`Are you sure you want to delete all ${currentData.totalExpenses} expenses? This action cannot be undone.`)) {
      return;
    }

    setClearingData(true);
    setMessage({ type: 'info', text: 'Clearing all data...' });

    try {
      console.log('🗑️ Clearing all data...');
      
      // Try backend first
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Backend unavailable');
      }

      const result = await response.json();
      console.log('✅ Data cleared via backend:', result);

      setCurrentData({ expenses: [], totalExpenses: 0, analytics: null });
      setMessage({ type: 'success', text: result.message || 'All data cleared successfully' });
      
    } catch (error) {
      console.log('⚠️ Backend unavailable, clearing data locally:', error.message);
      
      // Fallback to frontend-only clearing
      setCurrentData({ expenses: [], totalExpenses: 0, analytics: null });
      setMessage({ type: 'success', text: 'All data cleared successfully (local storage)' });
    } finally {
      setClearingData(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

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
    console.log('📁 File selected:', selectedFile.name, 'Type:', selectedFile.type, 'Size:', selectedFile.size);
    
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setMessage(null);
      console.log('✅ Valid CSV file selected');
    } else {
      console.error('❌ Invalid file type:', selectedFile.type);
      setMessage({ type: 'error', text: `Invalid file type: ${selectedFile.type}. Please upload a CSV file.` });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploadProgress(true);
    setMessage({ type: 'info', text: `Uploading ${file.name} to server...` });

    try {
      console.log('🚀 Starting file upload...');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('📤 Sending file to backend...');
      
      // Send file to backend API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📥 Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `${result.message}. ${result.data?.newExpenses || 0} expenses added.` 
        });
        
        // Refresh current data status
        await fetchCurrentData();
        
        // Call the parent component's onUpload callback with the processed data
        if (onUpload && typeof onUpload === 'function') {
          // Pass the actual expenses data, not the file
          await onUpload({ expenses: result.data?.expenses || [], source: 'backend' });
        }
        
        setFile(null);
        
        // Clear success message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
        
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' });
      }
      
    } catch (error) {
      console.error('🔥 Backend upload failed, trying frontend processing:', error);
      
      // Fallback to frontend-only processing
      if (error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setMessage({ type: 'info', text: 'Backend unavailable, processing CSV locally...' });
        await handleFrontendUpload();
      } else {
        let errorMessage = 'Upload failed: ';
        if (error.name === 'AbortError') {
          errorMessage += 'Upload timed out. Please try again with a smaller file.';
        } else {
          errorMessage += error.message;
        }
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setUploadProgress(false);
    }
  };

  // Frontend-only CSV processing fallback
  const handleFrontendUpload = async () => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file appears to be empty or has no data rows');
      }
      
      const newExpenses = [];
      const errors = [];
      
      // Skip header row (first line)
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
          
          if (values.length >= 3) {
            const [date, description, amount, mode] = values;
            
            if (!date || !description || !amount) {
              errors.push(`Line ${i + 1}: Missing required fields`);
              continue;
            }
            
            const parsedAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
              errors.push(`Line ${i + 1}: Invalid amount '${amount}'`);
              continue;
            }
            
            const expense = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: date || new Date().toISOString().split('T')[0],
              description: description || 'Unknown',
              amount: parsedAmount,
              mode: mode || 'Unknown',
              category: categorizeExpenseFrontend(description || 'Unknown'),
              currency: 'INR'
            };
            
            newExpenses.push(expense);
          } else {
            errors.push(`Line ${i + 1}: Insufficient columns (expected at least 3)`);
          }
        } catch (error) {
          errors.push(`Line ${i + 1}: ${error.message}`);
        }
      }
      
      if (newExpenses.length === 0) {
        throw new Error('No valid expenses found in the CSV file');
      }
      
      // Update local state (since backend is not available)
      const allExpenses = [...(currentData.expenses || []), ...newExpenses];
      const analytics = generateFrontendAnalytics(allExpenses);
      
      setCurrentData({
        expenses: allExpenses,
        totalExpenses: allExpenses.length,
        analytics: analytics
      });
      
      setMessage({ 
        type: 'success', 
        text: `✅ Processed ${newExpenses.length} expenses locally. ${errors.length > 0 ? `${errors.length} errors found.` : ''}` 
      });
      
      // Call parent callback with actual expenses data
      if (onUpload && typeof onUpload === 'function') {
        await onUpload({ expenses: allExpenses, source: 'frontend' });
      }
      
      setFile(null);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error) {
      console.error('🔥 Frontend processing failed:', error);
      setMessage({ type: 'error', text: `Frontend processing failed: ${error.message}` });
    }
  };

  // Frontend categorization function
  const categorizeExpenseFrontend = (description) => {
    const desc = description.toLowerCase();
    
    if (/food|restaurant|cafe|pizza|zomato|swiggy|dining|grocery/.test(desc)) {
      return 'Food & Dining';
    }
    if (/uber|taxi|transport|fuel|petrol|bus|metro/.test(desc)) {
      return 'Transportation';
    }
    if (/amazon|shopping|store|mall|flipkart|purchase/.test(desc)) {
      return 'Shopping';
    }
    if (/electricity|bill|utility|water|internet|mobile|recharge/.test(desc)) {
      return 'Bills & Utilities';
    }
    if (/movie|netflix|entertainment|game|spotify/.test(desc)) {
      return 'Entertainment';
    }
    if (/doctor|hospital|medical|pharmacy|health/.test(desc)) {
      return 'Healthcare';
    }
    if (/rent|mortgage|housing|maintenance/.test(desc)) {
      return 'Housing';
    }
    if (/education|course|book|school/.test(desc)) {
      return 'Education';
    }
    
    return 'Other';
  };

  // Frontend analytics generation
  const generateFrontendAnalytics = (expenses) => {
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = {};
    
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categories[cat] = (categories[cat] || 0) + exp.amount;
    });
    
    const topCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b, Object.keys(categories)[0] || 'None'
    );
    
    return {
      totalSpending,
      transactionCount: expenses.length,
      averageTransaction: expenses.length > 0 ? totalSpending / expenses.length : 0,
      categories,
      topCategory,
      insights: [
        `Total: ₹${totalSpending.toFixed(2)}`,
        `Transactions: ${expenses.length}`,
        `Average: ₹${(expenses.length > 0 ? totalSpending / expenses.length : 0).toFixed(2)}`,
        `Top: ${topCategory} (₹${(categories[topCategory] || 0).toFixed(2)})`
      ]
    };
  };

  return (
    <div className="space-y-5">
      {/* Current Data Status */}
      {currentData.totalExpenses > 0 && (
        <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/30 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="text-violet-400" size={22} />
              <div>
                <h3 className="text-base font-semibold text-white">
                  {currentData.totalExpenses} expenses loaded
                </h3>
                {currentData.analytics && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    Total: ₹{currentData.analytics.totalSpending?.toFixed(2) || '0.00'} • 
                    Top: {currentData.analytics.topCategory || 'None'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={fetchCurrentData}
                disabled={clearingData}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 text-sm font-medium"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleClearData}
                disabled={clearingData}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all disabled:opacity-50 border border-red-500/30 text-sm font-medium"
              >
                {clearingData ? (
                  <Activity className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>{clearingData ? 'Clearing...' : 'Clear All'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
          dragActive
            ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
            : file
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-gray-700 bg-[#1A1D29] hover:border-gray-600 hover:bg-[#1E2230]'
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
          disabled={loading || uploadProgress}
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {file ? (
            <FileText
              className="text-emerald-400 mb-4"
              size={56}
            />
          ) : (
            <Upload
              className={`mb-4 ${
                dragActive ? 'text-violet-400' : 'text-gray-500'
              }`}
              size={56}
            />
          )}
          
          <p className="text-lg font-semibold text-white mb-2">
            {file ? file.name : 'Drop your CSV file here'}
          </p>
          
          {file && (
            <p className="text-sm text-emerald-400 mb-2 font-medium">
              ✅ Ready to upload • {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
          
          <p className="text-sm text-gray-400">
            {file ? 'Click to select a different file' : 'or click to browse files'}
          </p>
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading || uploadProgress}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {uploadProgress ? (
            <>
              <Activity className="animate-spin" size={20} />
              <span>Processing CSV...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>
                {currentData.totalExpenses > 0 ? 'Add More Expenses' : 'Upload & Process'}
              </span>
            </>
          )}
        </button>
      )}

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : message.type === 'info'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : message.type === 'info' ? (
            <Activity size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center">
          <FileText size={20} className="mr-2" />
          CSV Format Guide
        </h4>
        
        <div className="text-sm text-blue-800 font-mono bg-white p-4 rounded-lg overflow-x-auto shadow-inner">
          <div className="font-bold text-blue-600 mb-1">Date,Description,Amount,Mode</div>
          <div className="text-gray-700">2025-10-01,Zomato Food Order,350,UPI</div>
          <div className="text-gray-700">2025-10-02,Uber Ride,220,Card</div>
          <div className="text-gray-700">2025-10-03,Grocery Shopping,1200,Cash</div>
        </div>
        
        <div className="mt-3 text-sm text-blue-700">
          <p><strong>✅ Supported:</strong> Date (YYYY-MM-DD), Description, Amount (numbers), Mode (optional)</p>
          <p><strong>📊 Auto-categorization:</strong> Food, Transportation, Shopping, Bills, Entertainment, Healthcare</p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
