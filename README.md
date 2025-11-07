# 💰 Expense Category Analyzer

A smart web application that helps users track, analyze, and visualize their spending habits through interactive dashboards and AI-powered insights.

![Expense Analyzer](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-orange)

## 🌟 Features

### ✅ Expense Upload
- **CSV File Upload**: Drag & drop or browse to upload expense data
- **Manual Entry**: Add individual expenses with a user-friendly form

### ✅ Automatic Categorization
The app uses intelligent keyword-based classification to automatically categorize transactions into:
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🏠 Rent & Housing
- 🏥 Healthcare
- 📚 Education
- 💅 Personal Care
- 📦 Miscellaneous

### ✅ Data Visualization Dashboard
- **Pie Chart**: Spending distribution by category
- **Bar Graph**: Top 5 expense categories
- **Line Chart**: Monthly spending trend
- **Transaction Table**: Detailed view of all expenses

### ✅ Smart Insights Generator
Get AI-like insights including:
- Total spending and transaction count
- Month-over-month comparison
- Category-wise analysis
- Daily spending statistics
- Highest and lowest spending days
- Average transaction amount

## 💻 Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **Chart.js** - Data Visualization
- **Axios** - API Calls
- **Lucide React** - Icons
- **PapaParse** - CSV Parsing

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **Multer** - File Upload
- **csv-parser** - CSV Processing
- **CORS** - Cross-Origin Support

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\intre\Desktop\this or that"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📊 CSV File Format

Your CSV file should have the following columns:

```csv
Date,Description,Amount,Mode
2025-09-01,Zomato - Lunch,350,UPI
2025-09-03,Uber,220,Card
2025-09-04,Rent,10000,Bank Transfer
2025-09-06,Amazon,999,Credit Card
```

**Column Details:**
- **Date**: Transaction date (YYYY-MM-DD format)
- **Description**: What the expense was for
- **Amount**: Cost in rupees
- **Mode**: Payment method (UPI, Card, Cash, etc.)

A sample CSV file is included: `sample-expenses.csv`

## 🎯 How to Use

1. **Upload Data**
   - Click on "Upload CSV" tab
   - Drag and drop your CSV file or click to browse
   - Click "Upload & Analyze"

2. **Manual Entry**
   - Switch to "Manual Entry" tab
   - Fill in the expense details
   - Click "Add Expense"

3. **View Insights**
   - Check the summary cards for quick stats
   - Explore the smart insights panel
   - View category distribution in the pie chart
   - Analyze trends in the line and bar graphs
   - Browse detailed transactions in the table

4. **Clear Data**
   - Click "Clear All Data" button to reset

## 🔧 API Endpoints

### Backend API

- `GET /api/health` - Health check
- `POST /api/upload` - Upload CSV file
- `POST /api/expenses` - Add manual expense
- `GET /api/expenses` - Get all expenses and analytics
- `DELETE /api/expenses` - Clear all expenses
- `GET /api/analytics` - Get analytics only

## 📁 Project Structure

```
this or that/
│
├── backend/
│   ├── server.js              # Express server
│   ├── categorizer.js         # Categorization logic
│   ├── insightsGenerator.js   # Insights generation
│   ├── package.json           # Backend dependencies
│   └── uploads/               # Temporary file storage
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js      # Header component
│   │   │   ├── FileUpload.js  # CSV upload component
│   │   │   ├── ManualEntry.js # Manual entry form
│   │   │   ├── Dashboard.js   # Charts and table
│   │   │   └── InsightsPanel.js # Insights display
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Styles
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
│
├── sample-expenses.csv        # Example data
└── README.md                  # This file
```

## 🎨 Features Breakdown

### Automatic Categorization
The system uses keyword matching to categorize expenses:
- Searches for keywords in transaction descriptions
- Maps to predefined categories
- Falls back to "Miscellaneous" if no match found

### Smart Insights
- **Month-over-Month**: Compares current vs previous month spending
- **Category Analysis**: Identifies dominant spending categories
- **Frequency Detection**: Finds high-frequency transaction categories
- **Daily Statistics**: Calculates average, max, and min daily spending

## 🔮 Future Enhancements

- 🔐 User Authentication (Firebase)
- 💾 Database Integration (MongoDB/Firebase)
- 📱 Mobile App
- 🧾 OCR Receipt Scanner
- 📈 Budget Setting & Alerts
- 🤖 ML-based Category Prediction
- 📊 Income vs Expense Tracking
- 👥 Multi-user Support
- 📤 Export Reports (PDF/Excel)

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Change PORT in `backend/server.js`
- Frontend: Create `.env` file with `PORT=3001`

### CORS Errors
Make sure the backend is running and the API_URL in `frontend/src/App.js` matches your backend URL.

### CSV Upload Issues
Ensure your CSV file:
- Has the correct column names (Date, Description, Amount, Mode)
- Uses comma as delimiter
- Has valid date formats

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Tailwind CSS for utility-first styling
- React community for amazing tools

---

**Made with ❤️ for better financial tracking**
