import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8000');

function App() {
  const [ socketID, setSocketID ] = useState("Connecting...");
  const [ lightValue, setLightValue ] = useState(0);
  const [ humidityValue, setHumidityValue ] = useState(0);
  const [ tempValue, setTempValue ] = useState(0);
  const [ ultrasonicValue, setUltrasonicValue ] = useState(0);
  const [ imageValue, setImageValue ] = useState({'image':'', 'description':''});

  // Establishing Node -> React Connection,
  // and appropriate callbacks for subscribed topics
  useEffect(() => {

    socket.on('connect', () => { setSocketID(socket.id); });
    socket.on('light', val => setLightValue(val));
    socket.on('humidity', val => setHumidityValue(val));
    socket.on('temp', val => setTempValue(val));
    socket.on('ultrasonic', val => setUltrasonicValue(val));
    socket.on('image-desc', val => setImageValue(val));
    
    return () => {
      socket.off('connect');
      socket.off('light');
      socket.off('humidity');
      socket.off('temp');
      socket.off('ultrasonic');
      socket.off('image-desc'); 
    };
  }, []);

  const requestLatestValue = (topic) => {
    console.log(`Requesting latest value for topic: ${topic}`);
    socket.emit(`request-${topic}`, "");
  };

// User Interface
  return (
    <div className="App">
      <header className="App-header">
        <img src="/team-name.svg" alt="Team Name" style={{ width: '150px', height: 'auto' }} />
      </header>
      
      <main className="dashboard-container">
        {/* Grid for displaying sensor data cards */}
        <div className="sensor-grid">
          <div className="sensor-card">
            <h2>Light Level</h2>
            <p className="sensor-value">{lightValue} lumens</p>
            <button className="btn-refresh" onClick={() => requestLatestValue('light')}>
              Retrieve Latest Value
            </button>
          </div>
          <div className="sensor-card">
            <h2>Humidity</h2>
            <p className="sensor-value">{humidityValue} %</p>
            <button className="btn-refresh" onClick={() => requestLatestValue('humidity')}>
              Retrieve Latest Value
            </button>
          </div>
          <div className="sensor-card">
            <h2>Temperature</h2>
            <p className="sensor-value">{tempValue} °F</p>
            <button className="btn-refresh" onClick={() => requestLatestValue('temp')}>
              Retrieve Latest Value
            </button>
          </div>
          <div className="sensor-card">
            <h2>Distance</h2>
            <p className="sensor-value">{ultrasonicValue} cm</p>
            <button className="btn-refresh" onClick={() => requestLatestValue('ultrasonic')}>
              Retrieve Latest Value
            </button>
          </div>
        </div>

        {/* Section for displaying the image and its description */}
        <div className="image-container">
          <h2>Image Analysis</h2>
          {imageValue.image ? (
            <>
              <img 
                src={"http://192.168.50.93/1600x1200.jpg"} 
                alt={imageValue.description || "Live feed from camera"} 
              />
              <p className="image-description">
                <strong>Description:</strong> {imageValue.description || "N/A"}
              </p>
            </>
          ) : (
            <div className="placeholder">
              <p>Waiting for image from server...</p>
            </div>
          )}
          <button className="btn-refresh" onClick={() => requestLatestValue('image-desc')}>
            Retrieve Latest Image
          </button>
        </div>
      </main>

      <footer className="App-footer">
        <p>Connected to Socket: {socket.id}</p>
      </footer>
    </div>
  );
}

export default App;