import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './CameraFeed.css';

const CameraFeed = ({ isEmergencyMode }) => {
  // You can replace this sample URL with your CCTV feed URL if needed.
  const cameraUrl = "https://images.unsplash.com/photo-1548407260-da850faa41e3"; 

  return (
    <div className="camera-container rounded-3 overflow-hidden bg-black ">
      <img 
        src={cameraUrl} 
        alt="Camera feed" 
        className={`w-100 h-8 object-fit-cover ${isEmergencyMode ? 'opacity-50' : ''}`}
      />  

      {isEmergencyMode && (
        <div className="emergency-overlay d-flex align-items-center justify-content-center">
          <div className="emergency-alert bg-danger px-4 py-2 rounded-3 d-flex align-items-center">
            <AlertTriangle className="me-2" />
            <span className="fw-bold">EMERGENCY MODE</span>
          </div>
        </div>
      )}

      <div className="camera-overlay">
        <div className="overlay-label top">LIVE</div>
        <div className="overlay-label bottom">360° • 30FPS</div>
      </div>
    </div>
  );
};

export default CameraFeed;
