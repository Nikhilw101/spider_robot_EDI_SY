import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import './JoystickControl.css';

const JoystickControl = ({ onControl, disabled }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState('');
  const joystickRef = useRef(null);
  const containerRef = useRef(null);
  
  const maxDistance = 50;

  const handleJoystickMove = (clientX, clientY) => {
    if (disabled || !joystickRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    let deltaX = clientX - containerRect.left - centerX;
    let deltaY = clientY - containerRect.top - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance;
      deltaY = (deltaY / distance) * maxDistance;
    }
    
    setPosition({ x: deltaX, y: deltaY });
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    let newDirection = '';
    
    if (distance > 10) {
      if (absX > absY) {
        newDirection = deltaX > 0 ? 'right' : 'left';
      } else {
        newDirection = deltaY > 0 ? 'backward' : 'forward';
      }
    }
    
    if (newDirection !== direction) {
      setDirection(newDirection);
      if (newDirection) {
        onControl(newDirection);
      }
    }
  };
  
  const handleStart = (clientX, clientY) => {
    if (disabled) return;
    setIsDragging(true);
    handleJoystickMove(clientX, clientY);
  };
  
  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    handleJoystickMove(clientX, clientY);
  };
  
  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setDirection('');
  };
  
  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };
  
  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };
  
  const handleMouseUp = () => {
    handleEnd();
  };
  
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const handleTouchEnd = () => {
    handleEnd();
  };
  
  useEffect(() => {
    if (isDragging) {
      const handleDocumentMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
      };
      
      const handleDocumentMouseUp = () => {
        handleEnd();
      };
      
      const handleDocumentTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      };
      
      const handleDocumentTouchEnd = () => {
        handleEnd();
      };
      
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      document.addEventListener('touchmove', handleDocumentTouchMove);
      document.addEventListener('touchend', handleDocumentTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
        document.removeEventListener('touchmove', handleDocumentTouchMove);
        document.removeEventListener('touchend', handleDocumentTouchEnd);
      };
    }
  }, [isDragging]);
  
  return (
    <div className="joystick-container">
      <div 
        ref={containerRef}
        className={`joystick-base position-relative rounded-circle ${
          disabled ? 'disabled' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="position-absolute top-0 start-50 translate-middle-x">
          <ArrowUp className={`direction-icon ${direction === 'forward' ? 'active' : ''}`} />
        </div>
        <div className="position-absolute bottom-0 start-50 translate-middle-x">
          <ArrowDown className={`direction-icon ${direction === 'backward' ? 'active' : ''}`} />
        </div>
        <div className="position-absolute start-0 top-50 translate-middle-y">
          <ArrowLeft className={`direction-icon ${direction === 'left' ? 'active' : ''}`} />
        </div>
        <div className="position-absolute end-0 top-50 translate-middle-y">
          <ArrowRight className={`direction-icon ${direction === 'right' ? 'active' : ''}`} />
        </div>

        <div 
          ref={joystickRef}
          className="joystick-handle position-absolute rounded-circle"
          style={{
            left: `calc(50% + ${position.x}px)`,
            top: `calc(50% + ${position.y}px)`,
          }}
        >
       
        </div>
        
        <div className="position-absolute start-50 top-50 translate-middle joystick-center"></div>
      </div>
      <div className="status-text text-center mt-3" style={{color:'whitesmoke'}}>
        {disabled ? 'CONTROLS DISABLED' : direction ? direction.toUpperCase() : 'READY'}
      </div>
    </div>
  );
};

export default JoystickControl;