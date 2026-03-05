import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { config } from '../api/config';

export function useSocket() {
  const [socketConnected, setSocketConnected] = useState(false);
  const queryClient = useQueryClient();
  const toastShownRef = useRef({ connect: false, disconnect: false });

  useEffect(() => {
    const socket = io(config.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      if (!toastShownRef.current.connect) {
        toast.success('Real-time updates connected');
        toastShownRef.current.connect = true;
      }
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      if (!toastShownRef.current.disconnect) {
        toast.warn('Real-time updates disconnected');
        toastShownRef.current.disconnect = true;
      }
      setSocketConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('activity', (data) => {
      console.log('📊 Activity received:', data);
      queryClient.setQueryData(['employees'], (old = []) => {
        const exists = old.find((e) => e.hostname === data.hostname || e.hostname === data.employeeId);
        if (!exists) {
          return [...old, {
            hostname: data.hostname || data.employeeId,
            status: data.isIdle || data.status === 'idle' ? 'idle' : 'online',
            lastActive: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
          }];
        }
        return old.map((e) => {
          if (e.hostname === data.hostname || e.hostname === data.employeeId) {
            return {
              ...e,
              lastActive: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
              status: data.isIdle || data.status === 'idle' ? 'idle' : 'online',
            };
          }
          return e;
        });
      });
    });

    socket.on('employee-activity-update', (data) => {
      console.log('📊 Employee activity update:', data);
      queryClient.setQueryData(['employees'], (old = []) => {
        const exists = old.find((e) => e.hostname === data.hostname || e.hostname === data.employeeId);
        if (!exists) {
          return [...old, {
            hostname: data.hostname || data.employeeId,
            status: data.isIdle || data.status === 'idle' ? 'idle' : 'online',
            lastActive: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
          }];
        }
        return old.map((e) => {
          if (e.hostname === data.hostname || e.hostname === data.employeeId) {
            return {
              ...e,
              lastActive: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
              status: data.isIdle || data.status === 'idle' ? 'idle' : 'online',
            };
          }
          return e;
        });
      });
    });

    socket.on('employee-updated', (emp) => {
      console.log('👤 Employee updated:', emp);
      queryClient.setQueryData(['employees'], (old = []) => {
        const exists = old.find((e) => e.hostname === emp.hostname || e._id === emp._id);
        if (exists) {
          return old.map((p) => (p._id === emp._id || p.hostname === emp.hostname ? { ...p, ...emp } : p));
        }
        return [emp, ...old];
      });
    });

    socket.on('employees-offline-check', () => {
      queryClient.invalidateQueries(['employees']);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return { socketConnected };
}
