import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { attendanceApi } from "../api/endpoints";
import { Download, Calculator, Calendar } from "lucide-react";

function Attendance() {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["attendance", startDate, endDate],
    queryFn: () => attendanceApi.get(startDate, endDate),
    enabled: !!startDate && !!endDate,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch attendance");
    },
  });

  const calculateMutation = useMutation({
    mutationFn: ({ startDate, endDate }) => attendanceApi.calculate(startDate, endDate),
    onSuccess: () => {
      toast.success("Attendance calculated successfully");
      queryClient.invalidateQueries(["attendance", startDate, endDate]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to calculate attendance");
    },
  });

  const handleCalculate = () => {
    calculateMutation.mutate({ startDate, endDate });
  };

  const exportCSV = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select date range");
      return;
    }
    try {
      const response = await attendanceApi.exportCSV(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_${startDate}_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getStatusBadge = (record, dateStr) => {
    if (!record) {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-600">
            Weekend
          </span>
        );
      }
      return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
          Absent
        </span>
      );
    }

    switch (record.status) {
      case "full_day":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
            Present
          </span>
        );
      case "half_day":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
            Half Day
          </span>
        );
      case "non_working":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-600">
            Weekend
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
            Absent
          </span>
        );
    }
  };

  const attendanceData = data?.employees || [];
  const dateRange = data?.dateRange || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Attendance Report</h1>
          <p className="text-slate-500 mt-1">Track and manage employee attendance</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Date Inputs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="text-slate-400" size={18} />
                <span className="text-sm text-slate-600 font-medium">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCalculate}
                disabled={calculateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Calculator size={16} />
                {calculateMutation.isPending ? "Calculating..." : "Calculate"}
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-slate-500">Loading...</div>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Calendar className="text-slate-300 mb-3" size={48} />
              <p className="text-slate-500">No attendance data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Absent
                    </th>
                    {dateRange.map((date) => (
                      <th
                        key={date}
                        className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[70px]"
                      >
                        {formatDate(date)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceData.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-800">
                          {emp.employeeName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600">
                        {emp.expectedDays}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">
                        {emp.presentDays}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">
                        {emp.absentDays}
                      </td>
                      {dateRange.map((date) => (
                        <td key={date} className="px-3 py-3 text-center">
                          {getStatusBadge(emp.attendanceByDate[date], date)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
