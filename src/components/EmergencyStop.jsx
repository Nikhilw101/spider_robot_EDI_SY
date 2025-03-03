import React from 'react';
import { Power } from 'lucide-react';
import './EmergencyStop.css';

const EmergencyStop = ({ isActive, onToggle }) => {
  return (
    <button
      className={`emergency-btn w-100 py-4 rounded-3 d-flex align-items-center justify-content-center ${
        isActive ? 'active' : ''
      }`}
      onClick={onToggle}
    >
      <Power className="me-2" size={24} />
      <span className="fw-bold fs-5">
        {isActive ? 'RESET EMERGENCY STOP' : 'EMERGENCY STOP'}
      </span>
    </button>
  );
};

export default EmergencyStop;