import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function ActivityChart({ summary }) {
  if (!summary) {
    return <p className="text-gray-500">No activity data available</p>;
  }

  const { totalKeyboard, totalMouse, entryCount } = summary;

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><BarChart2 size={20} />Daily Activity Summary</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-600">Keyboard Presses</p>
          <p className="text-2xl font-bold text-blue-600">{totalKeyboard}</p>
        </div>
        
        <div className="bg-green-50 rounded p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-600">Mouse Clicks</p>
          <p className="text-2xl font-bold text-green-600">{totalMouse}</p>
        </div>
        
        <div className="bg-purple-50 rounded p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-600">Activity Entries</p>
          <p className="text-2xl font-bold text-purple-600">{entryCount}</p>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Activity Breakdown</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Keyboard Activity</span>
              <span className="text-xs font-medium">{totalKeyboard}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((totalKeyboard / (totalKeyboard + totalMouse || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs">Mouse Activity</span>
              <span className="text-xs font-medium">{totalMouse}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min((totalMouse / (totalKeyboard + totalMouse || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
