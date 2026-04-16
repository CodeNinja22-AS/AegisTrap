import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  // Configurable backend URL
  const socketUrl = 'ws://127.0.0.1:8000/ws/threats';
  const [liveThreats, setLiveThreats] = useState([]);
  const [breachMode, setBreachMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveThreats((prev) => [data, ...prev].slice(0, 100)); // Keep last 100
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [socketUrl]);

  const toggleBreachMode = useCallback(() => {
    setBreachMode(prev => !prev);
  }, []);

  return (
    <WebSocketContext.Provider value={{
      liveThreats,
      isConnected,
      breachMode,
      toggleBreachMode
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketData = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketData must be used within a WebSocketProvider');
  }
  return context;
};
