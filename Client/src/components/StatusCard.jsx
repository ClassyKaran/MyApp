import React from 'react';
import StatusBadge from './StatusBadge';

export default function StatusCard({ employee }) {
  const { hostname, status, lastActive } = employee;

  const getLastActiveText = () => {
    if (!lastActive) return 'Never';
    const date = new Date(lastActive);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{hostname}</h3>
          <p className="text-sm text-gray-600 mt-1">Last Active: {getLastActiveText()}</p>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
