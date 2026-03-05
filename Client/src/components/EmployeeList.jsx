import React from 'react';
import EmployeeCard from './EmployeeCard';
import { Circle } from 'lucide-react';

export default function EmployeeList({ employees, selectedEmployee, onSelect }) {
  const groupedEmployees = {
    online: employees.filter((e) => e.status === 'online'),
    idle: employees.filter((e) => e.status === 'idle'),
    offline: employees.filter((e) => e.status === 'offline'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><Circle className="text-green-500" size={18} />Online ({groupedEmployees.online.length})</h2>
        <div className="space-y-2">
          {groupedEmployees.online.length > 0 ? (
            groupedEmployees.online.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onSelect={onSelect}
                isSelected={selectedEmployee?._id === emp._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No online employees</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><Circle className="text-yellow-500" size={18} />Idle ({groupedEmployees.idle.length})</h2>
        <div className="space-y-2">
          {groupedEmployees.idle.length > 0 ? (
            groupedEmployees.idle.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onSelect={onSelect}
                isSelected={selectedEmployee?._id === emp._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No idle employees</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><Circle className="text-red-500" size={18} />Offline ({groupedEmployees.offline.length})</h2>
        <div className="space-y-2">
          {groupedEmployees.offline.length > 0 ? (
            groupedEmployees.offline.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onSelect={onSelect}
                isSelected={selectedEmployee?._id === emp._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No offline employees</p>
          )}
        </div>
      </div>
    </div>
  );
}
