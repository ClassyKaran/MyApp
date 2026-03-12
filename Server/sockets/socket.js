import Employee from '../models/Employee.model.js';
import Activity from '../models/Activity.model.js';

let ioInstance = null;

export default function initSocket(io) {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log('🧵 socket connected', socket.id);

    socket.on('user-activity', async (payload) => {
      console.log('📊 Activity received:', payload);

      const hostname = payload.employeeId;
      const now = new Date();

      try {
        let employee = await Employee.findOne({ hostname });
        if (!employee) {
          employee = await Employee.create({ hostname, status: payload.status === 'idle' ? 'idle' : 'online', lastActive: now });
        } else {
          employee.status = payload.status === 'idle' ? 'idle' : 'online';
          employee.lastActive = now;
          await employee.save();
        }

        await Activity.create({
          employee: employee._id,
          hostname,
          keyboardCount: 0,
          mouseCount: 0,
          activeWindow: payload.activeWindow || null,
          timestamp: now,
        });

        const employeeData = {
          _id: employee._id,
          hostname: employee.hostname,
          status: employee.status,
          lastActive: employee.lastActive,
        };

        io.emit('employee-activity-update', {
          employeeId: hostname,
          hostname,
          idleTime: payload.idleTime,
          status: payload.status,
          timestamp: now.toISOString(),
          isIdle: payload.status === 'idle',
        });

        io.emit('employee-updated', employeeData);

        io.emit('activity', { 
          hostname, 
          timestamp: now.toISOString(),
          employeeId: hostname,
          isIdle: payload.status === 'idle',
        });
      } catch (err) {
        console.error('Error handling user-activity:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('🚫 socket disconnected', socket.id);
    });

    socket.on('request-screen-capture', (data) => {
      console.log('📺 Screen capture requested for:', data.hostname);
      io.emit('request-screen-capture', { hostname: data.hostname });
    });

    socket.on('stop-screen-capture', () => {
      console.log('🛑 Stop screen capture requested');
      io.emit('stop-screen-capture');
    });

    socket.on('screen-data', (data) => {
      console.log('📺 Screen data received for:', data.hostname);
      io.emit('screen-data', {
        image: data.image,
        hostname: data.hostname,
        timestamp: data.timestamp
      });
    });
  });
}

export { ioInstance as io };
