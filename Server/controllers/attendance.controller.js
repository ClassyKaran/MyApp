import Employee from '../models/Employee.model.js';
import Activity from '../models/Activity.model.js';
import Attendance from '../models/Attendance.model.js';
import { calculateDailySummary } from '../utils/workCalculator.js';

export const calculateAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const employees = await Employee.find();
    const results = [];

    for (const employee of employees) {
      const currentDate = new Date(start);
      
      while (currentDate <= end) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const activities = await Activity.find({
          employee: employee._id,
          timestamp: { $gte: dayStart, $lte: dayEnd }
        });

        let status = 'absent';
        let summary = null;

        if (activities.length > 0) {
          summary = calculateDailySummary(activities);
          if (summary) {
            status = summary.halfDay ? 'half_day' : 'full_day';
          } else {
            status = 'absent';
          }
        } else if (isWeekend) {
          status = 'non_working';
        }

        const attendanceData = {
          employee: employee._id,
          date: new Date(currentDate),
          status,
          loginTime: summary?.loginTime || null,
          logoutTime: summary?.logoutTime || null,
          activeTime: summary?.activeTime || '0h 0m',
          idleTime: summary?.idleTime || '0h 0m',
          onlineTime: summary?.onlineTime || '0h 0m',
          late: summary?.late || false,
          halfDay: summary?.halfDay || false,
          totalKeyboard: summary?.totalKeyboard || 0,
          totalMouse: summary?.totalMouse || 0,
        };

        await Attendance.findOneAndUpdate(
          { employee: employee._id, date: { $gte: dayStart, $lte: dayEnd } },
          attendanceData,
          { upsert: true, new: true }
        );

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    res.json({ success: true, message: 'Attendance calculated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const employees = await Employee.find();
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('employee', 'hostname');

    const dateRange = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const result = employees.map(employee => {
      const empAttendance = attendanceRecords.filter(
        att => att.employee && att.employee._id.toString() === employee._id.toString()
      );

      const attendanceByDate = {};
      dateRange.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const record = empAttendance.find(att => {
          const attDate = new Date(att.date).toISOString().split('T')[0];
          return attDate === dateStr;
        });
        attendanceByDate[dateStr] = record || null;
      });

      const presentDays = empAttendance.filter(a => a.status === 'full_day').length;
      const halfDays = empAttendance.filter(a => a.status === 'half_day').length;
      const absentDays = empAttendance.filter(a => a.status === 'absent').length;

      return {
        employeeId: employee._id,
        employeeName: employee.hostname,
        expectedDays: dateRange.length,
        presentDays: presentDays + halfDays,
        absentDays,
        attendanceByDate,
      };
    });

    res.json({ 
      employees: result, 
      dateRange: dateRange.map(d => d.toISOString().split('T')[0]) 
    });
  } catch (error) {
    next(error);
  }
};

export const exportAttendanceCSV = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const employees = await Employee.find();
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('employee', 'hostname');

    const dateRange = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let csv = 'Employee Name,Expected Days,Present Days,Absent Days';
    dateRange.forEach(date => {
      const dateStr = new Date(date).toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      });
      csv += `,${dateStr}`;
    });
    csv += '\n';

    employees.forEach(employee => {
      const empAttendance = attendanceRecords.filter(
        att => att.employee && att.employee._id.toString() === employee._id.toString()
      );

      const presentDays = empAttendance.filter(a => a.status === 'full_day').length;
      const halfDays = empAttendance.filter(a => a.status === 'half_day').length;
      const absentDays = empAttendance.filter(a => a.status === 'absent').length;

      let row = `${employee.hostname},${dateRange.length},${presentDays + halfDays},${absentDays}`;

      dateRange.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const record = empAttendance.find(att => {
          const attDate = new Date(att.date).toISOString().split('T')[0];
          return attDate === dateStr;
        });
        
        let status = 'Absent';
        if (record) {
          if (record.status === 'full_day') status = 'Full Day';
          else if (record.status === 'half_day') status = 'Half Day';
          else if (record.status === 'non_working') status = 'Non Working';
          else status = 'Absent';
        } else {
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) status = 'Non Working';
        }
        
        row += `,${status}`;
      });

      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
