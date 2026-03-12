import React from 'react';
import StatusBadge from './StatusBadge';
import { Monitor } from 'lucide-react';

export default function EmployeeCard({ employee, onSelect, isSelected, onViewLiveScreen }) {
  const { hostname, status } = employee;

  const handleLiveScreenClick = (e) => {
    e.stopPropagation();
    if (onViewLiveScreen) {
      onViewLiveScreen(employee);
    }
  };

  return (
    <div
      onClick={() => onSelect(employee)}
      className={`bg-white rounded-lg transition cursor-pointer p-4 border ${isSelected ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:shadow-lg'}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800">{hostname}</h3>
          <p className="text-xs text-gray-500 mt-1">Device Hostname</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'online' && (
            <button
              onClick={handleLiveScreenClick}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="View Live Screen"
            >
              <Monitor size={20} />
            </button>
          )}
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
