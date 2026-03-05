import Employee from '../models/Employee.model.js';
import Activity from '../models/Activity.model.js';
import { calculateDailySummary } from '../utils/workCalculator.js';
import { io } from '../sockets/socket.js';

export const postActivity = async (req, res, next) => {
  try {
    const { hostname, keyboardCount, mouseCount, activeWindow, timestamp, isIdle } = req.body;
    if (!hostname) return res.status(400).json({ error: 'hostname required' });

    let employee = await Employee.findOne({ hostname });
    if (!employee) {
      employee = await Employee.create({ hostname, status: 'offline' });
    }

    const activityTime = timestamp ? new Date(timestamp) : new Date();
    employee.lastActive = activityTime;
    employee.status = isIdle ? 'idle' : 'online';
    await employee.save();

    const activity = await Activity.create({
      employee: employee._id,
      hostname,
      keyboardCount,
      mouseCount,
      activeWindow,
      timestamp: activityTime,
    });

    const employeeData = {
      _id: employee._id,
      hostname: employee.hostname,
      status: employee.status,
      lastActive: employee.lastActive,
    };

    if (io) {
      io.emit('activity', { 
        hostname, 
        keyboardCount, 
        mouseCount, 
        activeWindow, 
        timestamp: activityTime.toISOString(),
        isIdle,
        employeeId: hostname,
      });
      
      io.emit('employee-updated', employeeData);
      
      io.emit('employee-activity-update', {
        employeeId: hostname,
        hostname,
        idleTime: 0,
        status: isIdle ? 'idle' : 'online',
        timestamp: activityTime.toISOString(),
        isIdle,
      });
    }

    res.json({ success: true, activity, employee: employeeData });
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort('hostname');
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { hostname } = req.params;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const activities = await Activity.find({ hostname, timestamp: { $gte: todayStart } });
    const summary = calculateDailySummary(activities);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
