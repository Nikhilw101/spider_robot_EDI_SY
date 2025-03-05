import React, { useState, useEffect } from "react";
import { Battery, Wifi, Thermometer, Menu, Flame } from 'lucide-react';

import CameraFeed from "./components/CameraFeed";
import ControlPad from "./components/ControlPad";
import JoystickControl from "./components/JoystickControl";
import SliderControl from "./components/SliderControl";
import SensorCard from "./components/SensorCard";
import StatusIndicator from "./components/StatusIndicator";
import EmergencyStop from "./components/EmergencyStop";
import { useGesture } from "./hooks/useGesture";
import "./App.css";

function App() {
  // State to track if the robot is active (i.e. started)
  const [robotActive, setRobotActive] = useState(false);
  // Connection status: 'disconnected' | 'connecting' | 'connected'
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [gasLevel, setGasLevel] = useState(50);
  const [signalStrength, setSignalStrength] = useState(78);
  const [lastAction, setLastAction] = useState("");
  const [controllerType, setControllerType] = useState("pad");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update connection status when robotActive changes.
  useEffect(() => {
    let timer;
    if (robotActive) {
      setConnectionStatus("connecting");
      timer = setTimeout(() => {
        setConnectionStatus("connected");
      }, 2000);
    } else {
      setConnectionStatus("disconnected");
    }
    return () => clearTimeout(timer);
  }, [robotActive]);

  // Only update sensor values if the robot is connected.
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.7 ? -1 : 0))));
      // Update gas level (simulate changes, e.g., ±5 ppm randomly)
      setGasLevel(prev => Math.max(0, prev + (Math.random() > 0.5 ? 5 : -5)));
      setSignalStrength(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 5000);
    return () => clearInterval(interval);
  }, [connectionStatus]);
  

  // Handle control actions only if robot is active and connected.
  const handleControl = (direction) => {
    if (!robotActive || connectionStatus !== "connected") return;
    navigator.vibrate?.(50);
    setLastAction(direction);
  };

  // Toggle robot active state (start/stop)
  const handleToggleRobot = () => {
    setRobotActive((prev) => !prev);
    navigator.vibrate?.(300);
  };

  // Gesture handling remains the same.
  const { ref } = useGesture({
    onSwipeUp: () => handleControl("forward"),
    onSwipeDown: () => handleControl("backward"),
    onSwipeLeft: () => handleControl("left"),
    onSwipeRight: () => handleControl("right"),
  });

  const switchController = (type) => {
    setControllerType(type);
    setIsMenuOpen(false);
    navigator.vibrate?.([50, 50, 50]);
  };

  // Disable controllers if not active or not connected.
  const renderController = () => {
    const isDisabled = !robotActive || connectionStatus !== "connected";
    switch (controllerType) {
      case "joystick":
        return (
          <JoystickControl onControl={handleControl} disabled={isDisabled} />
        );
      case "slider":
        return (
          <SliderControl onControl={handleControl} disabled={isDisabled} />
        );
      default:
        return <ControlPad onControl={handleControl} disabled={isDisabled} />;
    }
  };

  return (
    <div
      ref={ref}
      className={`app-container ${!robotActive ? "disabled-mode" : ""}`}
    >
      <header className="app-header">
        <h1 className="app-title">QUADBOT-X1</h1>
        <StatusIndicator status={connectionStatus} />
      </header>

      {/* Connection Message */}
      <div
        className={`connection-message ${
          connectionStatus === "connected" ? "connected" : "disconnected"
        }`}
      >
        {connectionStatus === "connected"
          ? "Robot is connected"
          : "Robot is disconnected"}
      </div>

      <main className="main-content">
        <div className="camera-section">
          <CameraFeed
            isEmergencyMode={!robotActive}
            connectionStatus={connectionStatus}
          />
          {lastAction && <div className="action-indicator">{lastAction}</div>}
        </div>

        <div className="controls-section">
          <div className="sensor-grid">
            <SensorCard
              title="Battery"
              value={`${batteryLevel}%`}
              icon={
                <Battery className={batteryLevel < 20 ? "text-danger" : ""} />
              }
              status={
                batteryLevel < 20
                  ? "critical"
                  : batteryLevel < 40
                  ? "warning"
                  : "normal"
              }
            />
            <SensorCard
              title="Gas"
              value={`${gasLevel} ppm`}
              icon={<Flame className={gasLevel > 300 ? "text-danger" : ""} />}
              status={
                gasLevel > 300
                  ? "critical"
                  : gasLevel > 200
                  ? "warning"
                  : "normal"
              }
            />

            <SensorCard
              title="Signal"
              value={`${signalStrength}%`}
              icon={
                <Wifi className={signalStrength < 30 ? "text-danger" : ""} />
              }
              status={
                signalStrength < 30
                  ? "critical"
                  : signalStrength < 50
                  ? "warning"
                  : "normal"
              }
            />
          </div>

          <div className="controller-menu">
            <button
              className="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={!robotActive || connectionStatus !== "connected"}
            >
              <Menu size={20} />
            </button>
            {isMenuOpen && (
              <div className="controller-options">
                <button
                  onClick={() => switchController("pad")}
                  className={controllerType === "pad" ? "active" : ""}
                >
                  D-Pad
                </button>
                <button
                  onClick={() => switchController("joystick")}
                  className={controllerType === "joystick" ? "active" : ""}
                >
                  Joystick
                </button>
                <button
                  onClick={() => switchController("slider")}
                  className={controllerType === "slider" ? "active" : ""}
                >
                  Sliders
                </button>
              </div>
            )}
          </div>

          <div className="controller-container">{renderController()}</div>
        </div>
      </main>

      <EmergencyStop isActive={robotActive} onToggle={handleToggleRobot} />
    </div>
  );
}

export default App;
