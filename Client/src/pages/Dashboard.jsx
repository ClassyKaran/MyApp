import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EmployeeList from '../components/EmployeeList';
import ActivityChart from '../components/ActivityChart';
import StatusCard from '../components/StatusCard';
import ScreenshotGallery from '../components/ScreenshotGallery';
import { Users, ArrowLeft, Circle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEmployees, queryKeys } from '../hooks/useEmployees';
import { useEmployeeSummary } from '../hooks/useEmployeeSummary';
import { useSocket } from '../hooks/useSocket';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { socketConnected } = useSocket();

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { data: summary } = useEmployeeSummary(selectedEmployee?.hostname);

  

  // Mark offline employees after 2 minutes of inactivity (update cache)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const twoMinutes = 2 * 60 * 1000;

      queryClient.setQueryData(queryKeys.employees, (old = []) =>
        old.map((emp) => {
          if (!emp.lastActive) return emp;
          const lastActiveTime = new Date(emp.lastActive).getTime();
          if (now - lastActiveTime > twoMinutes && emp.status !== 'offline') {
            return { ...emp, status: 'offline' };
          }
          return emp;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [queryClient]);


  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    // summary will be refetched by query
  };

  return (
    <div className="dashboard min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{employees.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Circle className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-3xl font-bold text-green-600">{employees.filter((e) => e.status === 'online').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Circle className="text-yellow-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Idle</p>
              <p className="text-3xl font-bold text-yellow-600">{employees.filter((e) => e.status === 'idle').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Circle className="text-red-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-3xl font-bold text-red-600">{employees.filter((e) => e.status === 'offline').length}</p>
            </div>
          </div>
        </div>



        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users size={24} />Employees</h2>
            {employeesLoading ? (
              <p className="text-gray-500">Loading employees...</p>
            ) : (
              <EmployeeList employees={employees} selectedEmployee={selectedEmployee} onSelect={handleSelectEmployee} />
            )}
          </div>

          {/* Selected Employee Details */}
          <div className="md:col-span-2 space-y-4    ">
            {selectedEmployee ? (
              <>
                <StatusCard employee={selectedEmployee} />
                {summary && <ActivityChart summary={summary} />}
                <ScreenshotGallery hostname={selectedEmployee.hostname} />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 flex items-center gap-1"><ArrowLeft size={16} />Select an employee to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
