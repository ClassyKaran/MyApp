import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { attendanceApi } from "../api/endpoints";

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

  const exportCSV = () => {
    const link = document.createElement("a");
    link.href = `/api/attendance/export?startDate=${startDate}&endDate=${endDate}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (record, dateStr) => {
    if (!record) {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return <span className="badge non-working">Non Working</span>;
      }
      return <span className="badge absent">Absent</span>;
    }

    switch (record.status) {
      case "full_day":
        return <span className="badge full-day">Full Day</span>;
      case "half_day":
        return <span className="badge half-day">Half Day</span>;
      case "non_working":
        return <span className="badge non-working">Non Working</span>;
      default:
        return <span className="badge absent">Absent</span>;
    }
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    controls: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    input: {
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
    },
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    calculateBtn: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    exportBtn: {
      backgroundColor: "#2196F3",
      color: "white",
    },
    tableContainer: {
      overflowX: "auto",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "800px",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      backgroundColor: "#f5f5f5",
      borderBottom: "2px solid #ddd",
      fontWeight: "600",
      fontSize: "14px",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      fontSize: "14px",
    },
    loading: {
      textAlign: "center",
      padding: "40px",
      color: "#666",
    },
  };

  const badgeStyles = `
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .full-day {
      background-color: #d4edda;
      color: #155724;
    }
    .half-day {
      background-color: #fff3cd;
      color: #856404;
    }
    .absent {
      background-color: #f8d7da;
      color: #721c24;
    }
    .non-working {
      background-color: #e2e3e5;
      color: #383d41;
    }
  `;

  const attendanceData = data?.employees || [];
  const dateRange = data?.dateRange || [];

  return (
    <>
      <style>{badgeStyles}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Attendance Report</h1>
        </div>

        <div style={styles.controls}>
          <label>
            From:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ ...styles.input, marginLeft: "8px" }}
            />
          </label>
          <label>
            To:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ ...styles.input, marginLeft: "8px" }}
            />
          </label>
          <button
            onClick={handleCalculate}
            disabled={calculateMutation.isPending}
            style={{ ...styles.button, ...styles.calculateBtn }}
          >
            {calculateMutation.isPending ? "Calculating..." : "Calculate Attendance"}
          </button>
          <button onClick={exportCSV} style={{ ...styles.button, ...styles.exportBtn }}>
            Export CSV
          </button>
        </div>

        {isLoading || isFetching ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={{ ...styles.tableContainer, marginTop: "20px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee Name</th>
                  <th style={styles.th}>Expected Days</th>
                  <th style={styles.th}>Present Days</th>
                  <th style={styles.th}>Absent Days</th>
                  {dateRange.map((date) => (
                    <th key={date} style={styles.th}>
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={4 + dateRange.length} style={{ ...styles.td, textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td style={styles.td}>{emp.employeeName}</td>
                      <td style={styles.td}>{emp.expectedDays}</td>
                      <td style={styles.td}>{emp.presentDays}</td>
                      <td style={styles.td}>{emp.absentDays}</td>
                      {dateRange.map((date) => (
                        <td key={date} style={styles.td}>
                          {getStatusBadge(emp.attendanceByDate[date], date)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Attendance;
