import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { config } from '../api/endpoints';

export function useLiveScreen(selectedHostname) {
  const [screenData, setScreenData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef(null);
  const selectedHostnameRef = useRef(selectedHostname);

  useEffect(() => {
    selectedHostnameRef.current = selectedHostname;
  }, [selectedHostname]);

  useEffect(() => {
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Client socket connected for live screen');
    });

    socketRef.current.on('screen-data', (data) => {
      console.log('Received screen-data:', data.hostname, 'looking for:', selectedHostnameRef.current);
      if (!selectedHostnameRef.current || data.hostname === selectedHostnameRef.current) {
        setScreenData(data);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startLiveScreen = useCallback((hostname) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('request-screen-capture', { hostname });
      setIsStreaming(true);
    } else {
      socketRef.current?.once('connect', () => {
        socketRef.current.emit('request-screen-capture', { hostname });
        setIsStreaming(true);
      });
    }
  }, []);

  const stopLiveScreen = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('stop-screen-capture');
      setIsStreaming(false);
    }
  }, []);

  return {
    screenData,
    isStreaming,
    startLiveScreen,
    stopLiveScreen,
  };
}
