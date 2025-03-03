import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Thermometer, Menu } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import ControlPad from './components/ControlPad';
import JoystickControl from './components/JoystickControl';
import SliderControl from './components/SliderControl';
import SensorCard from './components/SensorCard';
import StatusIndicator from './components/StatusIndicator';
import EmergencyStop from './components/EmergencyStop';
import { useGesture } from './hooks/useGesture';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [temperature, setTemperature] = useState(42);
  const [signalStrength, setSignalStrength] = useState(78);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [controllerType, setControllerType] = useState('pad');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setConnectionStatus('connected'), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.7 ? -1 : 0))));
      setTemperature(prev => Math.max(20, Math.min(80, prev + (Math.random() > 0.5 ? 1 : -1))));
      setSignalStrength(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 5000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleControl = (direction) => {
    if (isEmergencyMode) return;
    navigator.vibrate?.(50);
    setLastAction(direction);
  };

  const handleEmergencyStop = () => {
    setIsEmergencyMode(prev => !prev);
    navigator.vibrate?.(300);
  };

  const { ref } = useGesture({
    onSwipeUp: () => handleControl('forward'),
    onSwipeDown: () => handleControl('backward'),
    onSwipeLeft: () => handleControl('left'),
    onSwipeRight: () => handleControl('right'),
  });

  const switchController = (type) => {
    setControllerType(type);
    setIsMenuOpen(false);
    navigator.vibrate?.([50, 50, 50]);
  };

  const renderController = () => {
    const isDisabled = isEmergencyMode || connectionStatus !== 'connected';
    switch (controllerType) {
      case 'joystick': return <JoystickControl onControl={handleControl} disabled={isDisabled} />;
      case 'slider': return <SliderControl onControl={handleControl} disabled={isDisabled} />;
      default: return <ControlPad onControl={handleControl} disabled={isDisabled} />;
    }
  };

  return (
    <div ref={ref} className={`app-container ${isEmergencyMode ? 'emergency-mode' : ''}`}>
      <header className="app-header">
        <h1 className="app-title">QUADBOT-X1</h1>
        <StatusIndicator status={connectionStatus} />
      </header>

      <main className="main-content">
        <div className="camera-section">
          <CameraFeed isEmergencyMode={isEmergencyMode} connectionStatus={connectionStatus} />
          {lastAction && <div className="action-indicator">{lastAction}</div>}
        </div>

        <div className="controls-section">
          <div className="sensor-grid">
            <SensorCard 
              title="Battery" 
              value={`${batteryLevel}%`} 
              icon={<Battery className={batteryLevel < 20 ? 'text-danger' : ''} />} 
              status={batteryLevel < 20 ? 'critical' : batteryLevel < 40 ? 'warning' : 'normal'} 
            />
            <SensorCard 
              title="Temp" 
              value={`${temperature}°C`} 
              icon={<Thermometer className={temperature > 70 ? 'text-danger' : ''} />} 
              status={temperature > 70 ? 'critical' : temperature > 60 ? 'warning' : 'normal'} 
            />
            <SensorCard 
              title="Signal" 
              value={`${signalStrength}%`} 
              icon={<Wifi className={signalStrength < 30 ? 'text-danger' : ''} />} 
              status={signalStrength < 30 ? 'critical' : signalStrength < 50 ? 'warning' : 'normal'} 
            />
          </div>

          <div className="controller-menu">
            <button 
              className="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={20} />
            </button>
            {isMenuOpen && (
              <div className="controller-options">
                <button onClick={() => switchController('pad')} className={controllerType === 'pad' ? 'active' : ''}>
                  D-Pad
                </button>
                <button onClick={() => switchController('joystick')} className={controllerType === 'joystick' ? 'active' : ''}>
                  Joystick
                </button>
                <button onClick={() => switchController('slider')} className={controllerType === 'slider' ? 'active' : ''}>
                  Sliders
                </button>
              </div>
            )}
          </div>

          <div className="controller-container">
            {renderController()}
          </div>
        </div>
      </main>

      <EmergencyStop isActive={isEmergencyMode} onToggle={handleEmergencyStop} />
    </div>
  );
}

export default App;