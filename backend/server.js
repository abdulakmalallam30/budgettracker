import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS and middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Expense tracking endpoints with improved CSV processing
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

let expenses = [];

// Enhanced expense categorization
const categorizeExpense = (description) => {
  const desc = (description || '').toLowerCase();
  
  // Food & Dining
  if (desc.includes('food') || desc.includes('restaurant') || desc.includes('zomato') || 
      desc.includes('swiggy') || desc.includes('domino') || desc.includes('pizza') ||
      desc.includes('grocery') || desc.includes('cafe') || desc.includes('starbucks')) {
    return 'Food & Dining';
  }
  
  // Transportation
  if (desc.includes('uber') || desc.includes('ola') || desc.includes('taxi') || 
      desc.includes('transport') || desc.includes('fuel') || desc.includes('petrol') ||
      desc.includes('diesel') || desc.includes('bus') || desc.includes('metro')) {
    return 'Transportation';
  }
  
  // Shopping
  if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shopping') ||
      desc.includes('mall') || desc.includes('store') || desc.includes('myntra') ||
      desc.includes('clothing') || desc.includes('shoes')) {
    return 'Shopping';
  }
  
  // Entertainment
  if (desc.includes('movie') || desc.includes('netflix') || desc.includes('entertainment') ||
      desc.includes('game') || desc.includes('spotify') || desc.includes('youtube')) {
    return 'Entertainment';
  }
  
  // Bills & Utilities
  if (desc.includes('electricity') || desc.includes('bill') || desc.includes('utility') ||
      desc.includes('water') || desc.includes('internet') || desc.includes('mobile') ||
      desc.includes('recharge') || desc.includes('wifi')) {
    return 'Bills & Utilities';
  }
  
  // Healthcare
  if (desc.includes('doctor') || desc.includes('hospital') || desc.includes('medicine') ||
      desc.includes('pharmacy') || desc.includes('medical') || desc.includes('health')) {
    return 'Healthcare';
  }
  
  // Housing
  if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('housing') ||
      desc.includes('maintenance') || desc.includes('society')) {
    return 'Housing';
  }
  
  return 'Miscellaneous';
};

// Enhanced CSV upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('📁 File upload request received');
  
  // Set timeout to prevent hanging
  const timeout = setTimeout(() => {
    console.error('⏰ Upload timeout - forcing response');
    if (!res.headersSent) {
      res.status(408).json({ success: false, error: 'Upload timeout' });
    }
  }, 30000); // 30 second timeout
  
  try {
    if (!req.file) {
      clearTimeout(timeout);
      console.error('❌ No file provided');
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    
    console.log('📄 Processing file:', req.file.originalname, 'Size:', req.file.size, 'bytes');
    
    const newExpenses = [];
    const errors = [];
    let lineCount = 0;
    
    fs.createReadStream(req.file.path)
      .pipe(csvParser({
        skipEmptyLines: true,
        headers: ['Date', 'Description', 'Amount', 'Mode']
      }))
      .on('data', (data) => {
        lineCount++;
        console.log(`Processing line ${lineCount}:`, data);
        
        try {
          if (!data.Date || !data.Description || !data.Amount) {
            errors.push(`Line ${lineCount}: Missing required fields`);
            return;
          }
          
          const amount = parseFloat(data.Amount.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(amount) || amount <= 0) {
            errors.push(`Line ${lineCount}: Invalid amount '${data.Amount}'`);
            return;
          }
          
          const expense = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: data.Date,
            description: data.Description.trim(),
            amount: amount,
            mode: data.Mode || 'Unknown',
            category: categorizeExpense(data.Description)
          };
          
          newExpenses.push(expense);
          console.log('✅ Added expense:', expense.description, '₹' + expense.amount);
          
        } catch (error) {
          console.error(`Error processing line ${lineCount}:`, error);
          errors.push(`Line ${lineCount}: ${error.message}`);
        }
      })
      .on('end', () => {
        clearTimeout(timeout);
        
        try {
          console.log(`📊 CSV processing complete. Processed ${lineCount} lines, added ${newExpenses.length} expenses`);
          
          // Clean up uploaded file
          try {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Cleaned up temporary file');
          } catch (e) {
            console.warn('⚠️ Could not clean up temporary file:', e.message);
          }
          
          // Add to expenses array
          expenses.push(...newExpenses);
          
          // Generate analytics
          const analytics = generateAnalytics(expenses);
          
          const response = {
            success: true,
            message: `Successfully processed ${newExpenses.length} expenses from ${lineCount} lines`,
            data: {
              newExpenses: newExpenses.length,
              totalExpenses: expenses.length,
              analytics: analytics,
              errors: errors.length > 0 ? errors.slice(0, 5) : []
            },
            expenses: expenses
          };
          
          console.log('📤 Sending success response');
          
          if (!res.headersSent) {
            res.json(response);
          }
          
        } catch (error) {
          console.error('🔥 Error in end handler:', error);
          if (!res.headersSent) {
            res.status(500).json({ success: false, error: 'Processing failed: ' + error.message });
          }
        }
      })
      .on('error', (error) => {
        clearTimeout(timeout);
        console.error('🔥 CSV parsing error:', error);
        
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
        
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false,
            error: 'CSV processing failed: ' + error.message 
          });
        }
      });
      
  } catch (error) {
    clearTimeout(timeout);
    console.error('🔥 Upload error:', error);
    
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'Internal server error: ' + error.message
      });
    }
  }
});

// Generate analytics helper function
const generateAnalytics = (expensesData) => {
  if (!expensesData || expensesData.length === 0) {
    return {
      totalSpending: 0,
      averageTransaction: 0,
      transactionCount: 0,
      categoryBreakdown: {},
      insights: ['No expenses to analyze']
    };
  }
  
  const totalSpending = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const categoryTotals = {};
  
  expensesData.forEach(expense => {
    const category = expense.category || 'Miscellaneous';
    categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amount || 0);
  });
  
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, Object.keys(categoryTotals)[0] || 'None'
  );
  
  return {
    totalSpending: totalSpending,
    averageTransaction: totalSpending / expensesData.length,
    transactionCount: expensesData.length,
    categoryBreakdown: categoryTotals,
    topCategory: topCategory,
    insights: [
      `Total spending: ₹${totalSpending.toFixed(2)}`,
      `Average per transaction: ₹${(totalSpending / expensesData.length).toFixed(2)}`,
      `Most spending in: ${topCategory} (₹${(categoryTotals[topCategory] || 0).toFixed(2)})`
    ]
  };
};

app.post('/api/expenses', (req, res) => {
  console.log('📝 Manual expense entry request:', req.body);
  
  try {
    const { date, description, amount, mode } = req.body || {};
    
    if (!date || !description || !amount) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: date, description, amount' 
      });
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount must be a positive number' 
      });
    }
    
    const newExpense = { 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: date.trim(), 
      description: description.trim(), 
      amount: parsedAmount, 
      mode: (mode || 'Cash').trim(), 
      category: categorizeExpense(description)
    };
    
    expenses.push(newExpense);
    
    const analytics = generateAnalytics(expenses);
    
    console.log('✅ Manual expense added:', newExpense);
    
    res.json({ 
      success: true,
      message: 'Expense added successfully',
      expense: newExpense, 
      totalExpenses: expenses.length,
      analytics: analytics
    });
    
  } catch (error) {
    console.error('🔥 Manual entry error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add expense: ' + error.message
    });
  }
});

app.get('/api/expenses', (req, res) => {
  const analytics = generateAnalytics(expenses);
  
  res.json({ 
    success: true,
    expenses: expenses,
    totalExpenses: expenses.length,
    analytics: analytics
  });
});

// Delete all expenses
app.delete('/api/expenses', (req, res) => {
  const deletedCount = expenses.length;
  expenses = [];
  
  console.log(`🗑️ Cleared ${deletedCount} expenses`);
  
  res.json({ 
    success: true,
    message: `Cleared ${deletedCount} expenses`,
    totalExpenses: 0
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
