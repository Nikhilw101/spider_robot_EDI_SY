import React from 'react';
import './SensorCard.css';

const SensorCard = ({ title, value, icon, status }) => {
  return (
    <div className={`sensor-card border-start border-4 rounded p-2 ${status}`}>
      <div className="d-flex align-items-center mb-1">
        <span className="me-1">{icon}</span>
        <span className="text-uppercase fw-bold fs-7">{title}</span>
      </div>
      <div className="value-display fs-5 font-monospace">{value}</div>
    </div>
  );
};

export default SensorCard;