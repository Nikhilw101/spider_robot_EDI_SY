import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCw, RotateCcw } from 'lucide-react';
import './ControlPad.css';

const ControlPad = ({ onControl, disabled }) => {
  const [activeButton, setActiveButton] = useState(null);
  
  const handleButtonPress = (direction) => {
    if (disabled) return;
    setActiveButton(direction);
    onControl(direction);
  };
  
  const handleButtonRelease = () => {
    setActiveButton(null);
  };
  
  const controlButton = (direction, icon) => (
    <button
      className={`control-button rounded-circle p-3 ${disabled ? 'disabled' : ''} ${activeButton === direction ? 'active' : ''}`}
      onTouchStart={() => handleButtonPress(direction)}
      onTouchEnd={handleButtonRelease}
      onMouseDown={() => handleButtonPress(direction)}
      onMouseUp={handleButtonRelease}
      onMouseLeave={() => activeButton === direction && handleButtonRelease()}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div className="control-pad container">
      <div className="row g-2">
        <div className="col-4 d-flex justify-content-end">
          {controlButton('rotate-left', <RotateCcw size={24} />)}
        </div>
        <div className="col-4 d-flex justify-content-center">
          {controlButton('forward', <ChevronUp size={32} />)}
        </div>
        <div className="col-4 d-flex justify-content-start">
          {controlButton('rotate-right', <RotateCw size={24} />)}
        </div>

        <div className="col-4 d-flex justify-content-end">
          {controlButton('left', <ChevronLeft size={32} />)}
        </div>
        <div className="col-4 d-flex align-items-center justify-content-center">
          <div  style={{color:'white'}} className="status-text small pt-3">
            {disabled ? 'DISABLED' : activeButton || 'READY'}
          </div>
        </div>
        <div className="col-4 d-flex justify-content-start">
          {controlButton('right', <ChevronRight size={32} />)}
        </div>

        <div className="col-4"></div>
        <div className="col-4 d-flex justify-content-center">
          {controlButton('backward', <ChevronDown size={32} />)}
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
};

export default ControlPad;