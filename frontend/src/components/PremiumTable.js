import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export function PremiumTable({ data, columns, onDelete }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
      {/* Table Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="grid grid-cols-12 gap-4 px-6 py-4">
          {columns.map((column, index) => (
            <div
              key={index}
              className={`${column.className || ''} text-sm font-semibold text-slate-400 uppercase tracking-wider`}
            >
              {column.label}
            </div>
          ))}
          {onDelete && <div className="col-span-1 text-center text-sm font-semibold text-slate-400 uppercase">Actions</div>}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-700/30">
        {data.map((row, rowIndex) => (
          <motion.div
            key={row.id || rowIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors group"
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={`${column.className || ''} text-slate-300 flex items-center`}
              >
                {column.render ? column.render(row) : row[column.key]}
              </div>
            ))}
            {onDelete && (
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => onDelete(row.id)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-lg">No data available</p>
        </div>
      )}
    </div>
  );
}

export function CategoryBadge({ category }) {
  const colors = {
    Food: 'from-orange-600 to-amber-600',
    Transportation: 'from-blue-600 to-cyan-600',
    Shopping: 'from-pink-600 to-rose-600',
    Housing: 'from-purple-600 to-indigo-600',
    Healthcare: 'from-emerald-600 to-teal-600',
    Entertainment: 'from-violet-600 to-purple-600',
    Other: 'from-slate-600 to-slate-700'
  };

  return (
    <span className={`
      px-3 py-1 rounded-lg text-xs font-semibold text-white
      bg-gradient-to-r ${colors[category] || colors.Other}
      shadow-lg
    `}>
      {category}
    </span>
  );
}

export function TrendIndicator({ value }) {
  const isPositive = value > 0;
  
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      <span className="font-semibold">{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
}

export default PremiumTable;
