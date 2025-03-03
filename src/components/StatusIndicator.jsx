import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import './StatusIndicator.css';

const StatusIndicator = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'connected':
        return { icon: <Wifi size={16} />, label: 'CONNECTED', className: 'connected' };
      case 'connecting':
        return { icon: <Loader2 size={16} />, label: 'CONNECTING', className: 'connecting' };
      case 'disconnected':
        return { icon: <WifiOff size={16} />, label: 'DISCONNECTED', className: 'disconnected' };
      default:
        return { icon: <WifiOff size={16} />, label: 'UNKNOWN', className: 'unknown' };
    }
  };

  const { icon, label, className } = getStatusDetails();

  return (
    <div className={`status-indicator d-inline-flex align-items-center px-3 py-1 rounded-pill ${className}`}>
      <span className="icon-wrapper">{icon}</span>
      <span className="ms-2 label-text">{label}</span>
    </div>
  );
};

export default StatusIndicator;