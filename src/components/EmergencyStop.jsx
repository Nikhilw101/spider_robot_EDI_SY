import React from 'react';
import { Power, Play } from 'lucide-react';
import './EmergencyStop.css';

const EmergencyStop = ({ isActive, onToggle }) => {
  return (
    <div className="emergency-container d-flex w-100 mt-3 gap-3">
      <button
        className={`emergency-btn start-btn py-4 rounded-3 d-flex align-items-center justify-content-center flex-grow-1 ${!isActive ? 'active' : ''}`}
        onClick={() => {
          if (!isActive) onToggle();
        }}
        disabled={isActive}
      >
        <Play className="me-2" size={24} />
        <span className="fw-bold fs-5">START</span>
      </button>
      <button
        className={`emergency-btn stop-btn py-4 rounded-3 d-flex align-items-center justify-content-center flex-grow-1 ${isActive ? 'active' : ''}`}
        onClick={() => {
          if (isActive) onToggle();
        }}
        disabled={!isActive}
      >
        <Power className="me-2" size={24} />
        <span className="fw-bold fs-5">STOP</span>
      </button>
    </div>
  );
};

export default EmergencyStop;
