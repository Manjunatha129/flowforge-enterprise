import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { websocketService } from '../../services/websocketService';

/**
 * WebSocket Connection Status Badge Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Provides a visual real-time indicator of the STOMP WebSocket connection state (Live Connected, Reconnecting, Disconnected).
 */
export const ConnectionStatusBadge = () => {
  const [status, setStatus] = useState('DISCONNECTED');

  useEffect(() => {
    const unsubscribe = websocketService.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  if (status === 'CONNECTED') {
    return (
      <div
        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-medium transition-all shadow-sm"
        title="Real-time STOMP WebSocket connection active"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <Wifi className="w-3 h-3" />
        <span className="hidden sm:inline font-semibold">LIVE</span>
      </div>
    );
  }

  if (status === 'CONNECTING') {
    return (
      <div
        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[11px] font-medium transition-all shadow-sm"
        title="Reconnecting to real-time STOMP server..."
      >
        <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
        <span className="hidden sm:inline font-semibold">Connecting...</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-full text-[11px] font-medium transition-all shadow-sm"
      title="WebSocket disconnected. Click to reconnect."
      onClick={() => websocketService.connect()}
    >
      <WifiOff className="w-3 h-3 text-slate-400" />
      <span className="hidden sm:inline font-semibold">Offline</span>
    </div>
  );
};

export default ConnectionStatusBadge;
