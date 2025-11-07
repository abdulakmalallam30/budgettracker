require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const { categorizeExpenses, groupByCategory, groupByMonth, getTopCategories } = require('./categorizer');
const { generateInsights } = require('./insightsGenerator');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// In-memory storage for demo (replace with database in production)
let expensesData = [];

/**
 * Parse CSV file and return array of expenses
 */
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Normalize field names (handle different CSV formats)
        const expense = {
          date: data.Date || data.date || data.DATE,
          description: data.Description || data.description || data.DESCRIPTION,
          amount: data.Amount || data.amount || data.AMOUNT,
          mode: data.Mode || data.mode || data.MODE || 'Unknown'
        };
        
        // Validate required fields
        if (expense.date && expense.description && expense.amount) {
          // assign a lightweight unique id
          expense.id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
          results.push(expense);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Analyzer API is running' });
});

/**
 * Upload CSV file and process expenses
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse CSV file
    const expenses = await parseCSVFile(req.file.path);
    
    // Categorize expenses
    const categorizedExpenses = categorizeExpenses(expenses);
    // Ensure each expense has an id (categorizer may not add it)
    categorizedExpenses.forEach(exp => {
      if (!exp.id) exp.id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    });
    
    // Store in memory
    expensesData = categorizedExpenses;
    
    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);
    
    // Get analytics
    const categoryTotals = groupByCategory(categorizedExpenses);
    const monthlyTotals = groupByMonth(categorizedExpenses);
    const topCategories = getTopCategories(categoryTotals);
    const insights = generateInsights(categorizedExpenses, categoryTotals, monthlyTotals);
    
    res.json({
      success: true,
      message: `Successfully processed ${categorizedExpenses.length} transactions`,
      data: {
        expenses: categorizedExpenses,
        categoryTotals,
        monthlyTotals,
        topCategories,
        insights
      }
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      error: 'Error processing file', 
      message: error.message 
    });
  }
});

/**
 * Add manual expense entry
 */
app.post('/api/expenses', (req, res) => {
  try {
    const { date, description, amount, mode, currency = 'INR' } = req.body;
    
    // Validate input
    if (!date || !description || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, description, amount' 
      });
    }
    
    // Create expense object with currency
    const expense = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      date,
      description,
      amount: parseFloat(amount),
      mode: mode || 'Manual Entry',
      currency: currency || 'INR',
      originalAmount: parseFloat(amount), // Store original amount
      originalCurrency: currency || 'INR'  // Store original currency
    };
    
    // Categorize single expense
    const categorizedExpenses = categorizeExpenses([expense]);
    const categorizedExpense = categorizedExpenses[0];
    
    // Add to data store
    expensesData.push(categorizedExpense);
    
    res.json({
      success: true,
      message: 'Expense added successfully',
      data: categorizedExpense
    });
    
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ 
      error: 'Error adding expense', 
      message: error.message 
    });
  }
});

/**
 * Get all expenses and analytics
 */
app.get('/api/expenses', (req, res) => {
  try {
    const { currency = 'INR' } = req.query; // Get currency from query params
    
    const categoryTotals = groupByCategory(expensesData);
    const monthlyTotals = groupByMonth(expensesData);
    const topCategories = getTopCategories(categoryTotals);
    const insights = generateInsights(expensesData, categoryTotals, monthlyTotals, currency);
    
    res.json({
      success: true,
      data: {
        expenses: expensesData,
        categoryTotals,
        monthlyTotals,
        topCategories,
        insights
      }
    });
    
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      error: 'Error fetching expenses', 
      message: error.message 
    });
  }
});

/**
 * Clear all expenses
 */
app.delete('/api/expenses', (req, res) => {
  try {
    expensesData = [];
    res.json({
      success: true,
      message: 'All expenses cleared'
    });
  } catch (error) {
    console.error('Error clearing expenses:', error);
    res.status(500).json({ 
      error: 'Error clearing expenses', 
      message: error.message 
    });
  }
});

/**
 * Delete a specific expense by index
 */
app.delete('/api/expenses/:index', (req, res) => {
  try {
    const param = req.params.index;
    console.log('Delete request for:', param);
    
    // First try to find by ID (string match)
    const idxById = expensesData.findIndex(e => e.id === param);
    if (idxById !== -1) {
      console.log('Found expense by ID at index:', idxById);
      const deletedExpense = expensesData.splice(idxById, 1)[0];
      return res.json({ success: true, message: 'Expense deleted successfully', deletedExpense });
    }
    
    // If not found by ID, try numeric index (legacy support)
    const maybeIndex = parseInt(param);
    if (!isNaN(maybeIndex) && Number.isInteger(maybeIndex)) {
      const index = maybeIndex;
      if (index >= 0 && index < expensesData.length) {
        console.log('Found expense by index:', index);
        const deletedExpense = expensesData.splice(index, 1)[0];
        return res.json({ success: true, message: 'Expense deleted successfully', deletedExpense });
      } else {
        return res.status(400).json({ error: 'Invalid expense index' });
      }
    }

    // Neither ID nor valid index found
    return res.status(404).json({ error: 'Expense not found' });

  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      error: 'Error deleting expense', 
      message: error.message 
    });
  }
});

/**
 * Get analytics only
 */
app.get('/api/analytics', (req, res) => {
  try {
    const categoryTotals = groupByCategory(expensesData);
    const monthlyTotals = groupByMonth(expensesData);
    const topCategories = getTopCategories(categoryTotals);
    const insights = generateInsights(expensesData, categoryTotals, monthlyTotals);
    
    res.json({
      success: true,
      data: {
        categoryTotals,
        monthlyTotals,
        topCategories,
        insights
      }
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      error: 'Error fetching analytics', 
      message: error.message 
    });
  }
});

/**
 * Chat endpoint for Finance Bot powered by Gemini AI
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not configured. Make sure it is set in the .env file.');
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }
    console.log('✅ Gemini API key found.');
    console.log('Received message:', message);

    // Finance-focused system prompt
    const systemPrompt = `You are FinBot, a helpful and friendly AI finance assistant. Your expertise includes:

CORE RESPONSIBILITIES:
- Personal budgeting and expense tracking
- Investment advice for beginners to intermediate investors  
- Savings strategies and financial planning
- Debt management and credit improvement
- Financial education and literacy
- Currency and market insights
- Tax planning basics (US-focused but mention international considerations)

PERSONALITY:
- Friendly, encouraging, and supportive
- Use simple language and avoid jargon
- Provide actionable, practical advice
- Always emphasize the importance of personal research
- Be optimistic but realistic about financial goals

RESPONSE GUIDELINES:
- Keep responses concise (under 200 words when possible)
- Use bullet points for multiple tips
- Include relevant emojis sparingly (💰 💡 📊 📈 ✅)
- Always add a disclaimer for investment advice
- Ask follow-up questions to provide better personalized advice
- Reference the user's expense tracking app when relevant

IMPORTANT DISCLAIMERS:
- Always mention that advice is for educational purposes
- Recommend consulting financial advisors for complex situations
- Emphasize personal research before making investment decisions

User Question: ${message}

Please provide a helpful finance response:`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Provide fallback response
    const fallbackResponses = {
      budget: "💰 Creating a budget is essential! Start with the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Track your income and expenses for a month to see where your money goes. Our expense tracker can help you categorize spending! What's your biggest spending category?",
      investment: "📊 Great question! For beginners, consider starting with:\n• Index funds or ETFs (diversified, lower risk)\n• Dollar-cost averaging strategy\n• Emergency fund first (3-6 months expenses)\n• Only invest money you won't need for 5+ years\n\n⚠️ Always do your research and consider consulting a financial advisor. What's your investment timeline?",
      expense: "📈 Smart expense tracking tips:\n• Categorize everything (housing, food, transport, entertainment)\n• Review spending weekly\n• Use our built-in tracker for insights\n• Look for patterns and surprises\n• Set spending limits per category\n\nSmall daily expenses often add up more than you think! What category surprises you most?",
      saving: "✅ Proven saving strategies:\n• Pay yourself first - save before spending\n• Automate transfers to savings\n• Use the envelope method for discretionary spending\n• Find cheaper alternatives for recurring expenses\n• Set specific, measurable goals\n\n💡 Even $5/day = $1,825/year! What's your savings goal?"
    };

    const userMessage = req.body.message.toLowerCase();
    let fallbackResponse = "💡 I'm here to help with all your finance questions! I can assist with budgeting, investment basics, saving strategies, debt management, credit improvement, and financial planning. What specific area would you like to explore?";

    if (userMessage.includes('budget')) fallbackResponse = fallbackResponses.budget;
    else if (userMessage.includes('invest')) fallbackResponse = fallbackResponses.investment;
    else if (userMessage.includes('expense') || userMessage.includes('track')) fallbackResponse = fallbackResponses.expense;
    else if (userMessage.includes('save') || userMessage.includes('saving')) fallbackResponse = fallbackResponses.saving;

    res.json({
      success: true,
      response: fallbackResponse + "\n\n(Note: AI assistant temporarily unavailable, using basic responses)"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Expense Analyzer API running on http://localhost:${PORT}`);
  console.log(`📊 Ready to process expense data!`);
});
