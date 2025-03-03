import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';
import './SliderControl.css';

const SliderControl = ({ onControl, disabled }) => {
  const [xValue, setXValue] = useState(50);
  const [yValue, setYValue] = useState(50);
  const [rotationValue, setRotationValue] = useState(50);
  const [lastDirection, setLastDirection] = useState('');
  
  const MOVEMENT_THRESHOLD = 10;
  
  const handleXChange = (e) => {
    if (disabled) return;
    
    const newValue = parseInt(e.target.value);
    setXValue(newValue);
    
    let direction = '';
    if (Math.abs(newValue - 50) > MOVEMENT_THRESHOLD) {
      direction = newValue < 50 ? 'left' : 'right';
    }
    
    if (direction && direction !== lastDirection) {
      setLastDirection(direction);
      onControl(direction);
    } else if (!direction && (lastDirection === 'left' || lastDirection === 'right')) {
      setLastDirection('');
    }
  };
  
  const handleYChange = (e) => {
    if (disabled) return;
    
    const newValue = parseInt(e.target.value);
    setYValue(newValue);
    
    let direction = '';
    if (Math.abs(newValue - 50) > MOVEMENT_THRESHOLD) {
      direction = newValue < 50 ? 'forward' : 'backward';
    }
    
    if (direction && direction !== lastDirection) {
      setLastDirection(direction);
      onControl(direction);
    } else if (!direction && (lastDirection === 'forward' || lastDirection === 'backward')) {
      setLastDirection('');
    }
  };
  
  const handleRotationChange = (e) => {
    if (disabled) return;
    
    const newValue = parseInt(e.target.value);
    setRotationValue(newValue);
    
    let direction = '';
    if (Math.abs(newValue - 50) > MOVEMENT_THRESHOLD) {
      direction = newValue < 50 ? 'rotate-left' : 'rotate-right';
    }
    
    if (direction && direction !== lastDirection) {
      setLastDirection(direction);
      onControl(direction);
    } else if (!direction && (lastDirection === 'rotate-left' || lastDirection === 'rotate-right')) {
      setLastDirection('');
    }
  };
  
  const handleReset = () => {
    setXValue(50);
    setYValue(50);
    setRotationValue(50);
    setLastDirection('');
  };

  return (
    <div className="slider-control">
      {/* Y Axis Slider - Forward/Backward */}
      <div className="slider-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <ArrowUp className={`direction-icon ${lastDirection === 'forward' ? 'active' : ''}`} />
          <span className="slider-label">FORWARD/BACKWARD</span>
          <ArrowDown className={`direction-icon ${lastDirection === 'backward' ? 'active' : ''}`} />
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={yValue}
          onChange={handleYChange}
          disabled={disabled}
        />
      </div>

      {/* X Axis Slider - Left/Right */}
      <div className="slider-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <ArrowLeft className={`direction-icon ${lastDirection === 'left' ? 'active' : ''}`} />
          <span className="slider-label">LEFT/RIGHT</span>
          <ArrowRight className={`direction-icon ${lastDirection === 'right' ? 'active' : ''}`} />
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={xValue}
          onChange={handleXChange}
          disabled={disabled}
        />
      </div>

      {/* Rotation Slider */}
      <div className="slider-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <RotateCcw className={`direction-icon ${lastDirection === 'rotate-left' ? 'active' : ''}`} />
          <span className="slider-label">ROTATION</span>
          <RotateCw className={`direction-icon ${lastDirection === 'rotate-right' ? 'active' : ''}`} />
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={rotationValue}
          onChange={handleRotationChange}
          disabled={disabled}
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        disabled={disabled}
        className="reset-btn w-100 py-2 rounded-2 mb-3"
      >
        CENTER ALL
      </button>

      {/* Status Text */}
      <div className="status-text text-center">
        {disabled ? 'CONTROLS DISABLED' : lastDirection ? lastDirection.toUpperCase() : 'READY'}
      </div>
    </div>
  );
};

export default SliderControl;