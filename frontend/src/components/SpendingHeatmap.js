import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

function SpendingHeatmap({ expenses, selectedCurrency = 'USD' }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate daily spending totals
  const dailySpending = useMemo(() => {
    const spending = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!spending[dateKey]) {
        spending[dateKey] = 0;
      }
      spending[dateKey] += parseFloat(expense.amount);
    });
    
    return spending;
  }, [expenses]);

  // Get max spending for color intensity calculation
  const maxSpending = Math.max(...Object.values(dailySpending), 1);

  // Get intensity level (0-4) based on spending amount
  const getIntensity = (amount) => {
    if (!amount || amount === 0) return 0;
    const percentage = (amount / maxSpending) * 100;
    if (percentage < 20) return 1;
    if (percentage < 40) return 2;
    if (percentage < 60) return 3;
    if (percentage < 80) return 4;
    return 5;
  };

  // Get color based on intensity
  const getColor = (intensity) => {
    const colors = [
      'bg-slate-800/30', // 0 - no spending
      'bg-emerald-900/40', // 1 - very low
      'bg-emerald-700/50', // 2 - low
      'bg-amber-600/60', // 3 - medium
      'bg-orange-600/70', // 4 - high
      'bg-rose-600/80', // 5 - very high
    ];
    return colors[intensity];
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isEmpty: true, key: `empty-${i}` });
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      const amount = dailySpending[dateKey] || 0;
      const intensity = getIntensity(amount);

      days.push({
        day,
        date: dateKey,
        amount,
        intensity,
        isToday: dateKey === new Date().toISOString().split('T')[0]
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate month stats
  const monthStats = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const monthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
    
    let total = 0;
    let days = 0;
    let highest = 0;
    let highestDate = '';

    Object.entries(dailySpending).forEach(([date, amount]) => {
      if (date >= monthStart && date <= monthEnd) {
        total += amount;
        days++;
        if (amount > highest) {
          highest = amount;
          highestDate = date;
        }
      }
    });

    return {
      total,
      average: days > 0 ? total / days : 0,
      highest,
      highestDate,
      daysWithSpending: days
    };
  }, [dailySpending, currentYear, currentMonth]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon size={28} className="text-indigo-400" />
            Spending Heatmap
          </h2>
          <p className="text-slate-400 text-sm mt-1">Visual calendar of your daily spending intensity</p>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-all text-sm font-medium"
        >
          Today
        </button>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Total Spending</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(monthStats.total, selectedCurrency)}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Daily Average</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(monthStats.average, selectedCurrency)}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Highest Day</div>
          <div className="text-2xl font-bold text-rose-400">
            {formatCurrency(monthStats.highest, selectedCurrency)}
          </div>
          {monthStats.highestDate && (
            <div className="text-xs text-slate-500 mt-1">
              {new Date(monthStats.highestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Active Days</div>
          <div className="text-2xl font-bold text-emerald-400">
            {monthStats.daysWithSpending}
          </div>
          <div className="text-xs text-slate-500 mt-1">days with expenses</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card p-6 rounded-2xl border border-slate-700/50">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <h3 className="text-xl font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayData, index) => {
            if (dayData.isEmpty) {
              return <div key={dayData.key} className="aspect-square" />;
            }

            return (
              <motion.div
                key={dayData.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="relative group"
              >
                <div
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center
                    ${getColor(dayData.intensity)}
                    ${dayData.isToday ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : ''}
                    border border-slate-700/30
                    transition-all duration-200
                    cursor-pointer
                  `}
                >
                  <div className={`text-sm font-semibold ${dayData.amount > 0 ? 'text-white' : 'text-slate-500'}`}>
                    {dayData.day}
                  </div>
                  {dayData.amount > 0 && (
                    <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                      {dayData.amount >= 1000 ? `${(dayData.amount / 1000).toFixed(1)}k` : dayData.amount.toFixed(0)}
                    </div>
                  )}
                </div>

                {/* Tooltip */}
                {dayData.amount > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl whitespace-nowrap">
                      <div className="text-xs text-slate-400 mb-1">
                        {new Date(dayData.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(dayData.amount, selectedCurrency)}
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-700"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">Spending Intensity</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Less</span>
              {[0, 1, 2, 3, 4, 5].map(intensity => (
                <div
                  key={intensity}
                  className={`w-6 h-6 rounded ${getColor(intensity)} border border-slate-700/30`}
                />
              ))}
              <span className="text-xs text-slate-500">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpendingHeatmap;
