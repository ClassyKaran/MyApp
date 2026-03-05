import React, { useState } from 'react';
import EmployeeList from '../components/EmployeeList';
import StatusCard from '../components/StatusCard';
import ActivityChart from '../components/ActivityChart';
import ScreenshotGallery from '../components/ScreenshotGallery';
import { Users, ArrowLeft } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeSummary } from '../hooks/useEmployeeSummary';
import { useSocket } from '../hooks/useSocket';


export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data: employees = [], isLoading: loading } = useEmployees();
  const { data: summary } = useEmployeeSummary(selectedEmployee?.hostname);
  const { socketConnected } = useSocket();


  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users size={24} />Employees</h2>
        {loading ? (
          <p className="text-gray-500">Loading employees...</p>
        ) : (
          <EmployeeList employees={employees} selectedEmployee={selectedEmployee} onSelect={handleSelectEmployee} />
        )}
      </div>

      <div className="space-y-4">
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
  );
}
