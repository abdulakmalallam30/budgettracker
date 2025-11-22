import React from 'react';

// Skeleton loader component for better perceived performance
export function ChartSkeleton() {
  return (
    <div className="bg-[#1A1D29] rounded-xl border border-gray-800/50 p-6 animate-pulse">
      <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
      <div className="h-80 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading chart...</p>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#1A1D29] rounded-xl border border-gray-800/50 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-[#1A1D29] rounded-xl border border-gray-800/50 overflow-hidden">
      <div className="p-6 border-b border-gray-800/50 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/4"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#0F1117] border-b border-gray-800/50">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-800 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, i) => (
              <tr key={i} className="border-b border-gray-800/50 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {[...Array(6)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-800/50 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin`}></div>
      <p className="mt-4 text-gray-400 font-medium">{message}</p>
    </div>
  );
}

const loaders = { ChartSkeleton, StatCardSkeleton, TableSkeleton, LoadingSpinner };
export default loaders;
