import React from 'react';
import StatusBadge from './StatusBadge';

export default function EmployeeCard({ employee, onSelect, isSelected }) {
  const { hostname, status } = employee;

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
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
