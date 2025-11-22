import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryUtils';
import { FileText, FileSpreadsheet, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/currencyUtils';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

function Dashboard({ analytics, expenses = [], onDeleteExpense, showOnlyCharts, showOnlyTransactions, selectedCurrency = 'INR' }) {
  if (!analytics) return null;

  // Ensure expenses is always an array
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const { categoryTotals = {}, monthlyTotals = {}, topCategories = [] } = analytics;

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Mode'];
    const csvData = safeExpenses.map(exp => [
      new Date(exp.date).toLocaleDateString('en-IN'),
      exp.description,
      exp.category,
      exp.amount,
      exp.mode
    ]);

    let csvContent = headers.join(',') + '\n';
    csvData.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('Expense Report', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);
    
    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Expenses: ₹${analytics?.insights?.totalSpending || 0}`, 14, 38);
    doc.text(`Total Transactions: ${analytics?.insights?.transactionCount || 0}`, 14, 45);
    doc.text(`Average Transaction: ₹${analytics?.insights?.averageTransaction || 0}`, 14, 52);
    
    // Category Breakdown
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text('Category Breakdown', 14, 65);
    
    const categoryData = Object.entries(categoryTotals).map(([cat, amt]) => [
      cat,
      `₹${amt.toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 70,
      head: [['Category', 'Amount']],
      body: categoryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });
    
    // Transaction Details
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text('Transaction Details', 14, doc.lastAutoTable.finalY + 15);
    
    const transactionData = safeExpenses.slice(0, 50).map(exp => [
      new Date(exp.date).toLocaleDateString('en-IN'),
      exp.description.substring(0, 30),
      exp.category,
      `₹${parseFloat(exp.amount).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: transactionData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Pie Chart Data - Category Distribution
  const pieChartData = {
    labels: Object.keys(categoryTotals || {}),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(categoryTotals || {}),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF9F40'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: {
            size: 13,
            family: 'Inter'
          },
          color: '#cbd5e1'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: '#8b5cf6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Bar Chart Data - Top Categories
  const barChartData = {
    labels: (topCategories || []).map(cat => cat.category),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: (topCategories || []).map(cat => cat.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: '#8b5cf6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)'
        },
        ticks: {
          color: '#cbd5e1',
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  // Line Chart Data - Monthly Trend
  const sortedMonths = Object.keys(monthlyTotals || {}).sort();
  const lineChartData = {
    labels: sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, monthNum - 1);
      return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Monthly Spending',
        data: sortedMonths.map(month => (monthlyTotals || {})[month] || 0),
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: '#8b5cf6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)'
        },
        ticks: {
          color: '#cbd5e1',
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  // Only show charts
  if (showOnlyCharts) {
    return (
      <div className="space-y-8">
        {/* Export Buttons */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
          >
            <FileSpreadsheet size={20} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
          >
            <FileText size={20} />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-[#1A1D29] rounded-2xl p-6 border border-gray-800/50 shadow-2xl hover:shadow-violet-500/5 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-1 animate-fadeIn stagger-1">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span>Category Distribution</span>
            </h3>
            <div className="h-96">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#1A1D29] rounded-2xl p-6 border border-gray-800/50 shadow-2xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 animate-fadeIn stagger-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <span>Top Categories</span>
            </h3>
            <div className="h-96">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart - Full Width */}
        {sortedMonths.length > 1 && (
          <div className="bg-[#1A1D29] rounded-2xl p-6 border border-gray-800/50 shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 animate-fadeIn stagger-3">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <span>Spending Trends</span>
            </h3>
            <div className="h-96">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Only show transactions
  if (showOnlyTransactions) {
    return (
      <div className="bg-[#1A1D29] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
              <span className="text-3xl">💳</span>
            </div>
            <span>All Transactions <span className="text-violet-400 font-medium">({safeExpenses.length})</span></span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#0F1117] border-b border-gray-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {safeExpenses.slice().reverse().map((expense, index) => {
                const actualIndex = safeExpenses.length - 1 - index;
                return (
                <tr 
                  key={index}
                  className="hover:bg-[#252936] transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex items-center gap-2 text-xs font-semibold rounded-lg bg-gradient-to-r ${getCategoryColor(expense.category)} text-white`}>
                      <span className="text-sm">{getCategoryIcon(expense.category)}</span>
                      <span>{expense.category}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                    {expense.mode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-emerald-400">
                    {expense.originalCurrency && expense.originalAmount 
                      ? formatCurrency(expense.originalAmount, expense.originalCurrency)
                      : formatCurrency(parseFloat(expense.amount), expense.currency || selectedCurrency)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        console.log('=== DELETE BUTTON CLICKED ===');
                        console.log('Full expense object:', expense);
                        console.log('expense.id:', expense.id);
                        console.log('actualIndex:', actualIndex);
                        
                        // Use ID if available, otherwise use index
                        const idToDelete = expense.id || actualIndex;
                        console.log('ID to delete:', idToDelete, typeof idToDelete);
                        console.log('=== CALLING onDeleteExpense ===');
                        onDeleteExpense(idToDelete);
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 inline-flex items-center justify-center border border-red-500/20 hover:border-red-500/40"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Original full dashboard (used for overview)
  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
        >
          <FileSpreadsheet size={18} />
          <span>Export CSV</span>
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
        >
          <FileText size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#1A1D29] rounded-xl p-6 border border-gray-800/50 shadow-2xl hover:border-gray-700/50 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span>Spending by Category</span>
          </h3>
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#1A1D29] rounded-xl p-6 border border-gray-800/50 shadow-2xl hover:border-gray-700/50 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <span>Top 5 Expense Categories</span>
          </h3>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Line Chart - Full Width */}
      {sortedMonths.length > 1 && (
        <div className="bg-[#1A1D29] rounded-xl p-6 border border-gray-800/50 shadow-2xl hover:border-gray-700/50 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="animate-pulse">📈</span>
            <span>Monthly Spending Trend</span>
          </h3>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      )}

      {/* Expense Table */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden opacity-0 animate-slideUp stagger-5">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
          <span className="animate-pulse">📋</span>
          <span>Recent Transactions</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-purple-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeExpenses.slice().reverse().slice(0, 20).map((expense, index) => {
                // Calculate the actual index in the original array
                const actualIndex = safeExpenses.length - 1 - index;
                return (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 transform hover:scale-[1.01]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(expense.category)} text-white shadow-md`}>
                      <span>{getCategoryIcon(expense.category)}</span>
                      <span>{expense.category}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {expense.mode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onDeleteExpense(expense.id ?? actualIndex)}
                          className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center mx-auto"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {safeExpenses.length > 20 && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Showing 20 most recent transactions out of {safeExpenses.length} total
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
