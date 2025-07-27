import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8000');

function App() {
  const [ socketID, setSocketID ] = useState("");
  const [ lightValue, setLightValue ] = useState(0);
  const [ humidityValue, setHumidityValue ] = useState(0);
  const [ tempValue, setTempValue ] = useState(0);
  const [ ultrasonicValue, setUltrasonicValue ] = useState(0);
  const [ imageTimestamp, setImageTimestamp ] = useState("");
  const [ imageDescription, setImageDescription ] = useState("");

  // Establishing Node -> React Connection,
  // and appropriate callbacks for subscribed topics
  useEffect(() => {

    socket.on('connect', () => { setSocketID(socket.id); });
    socket.on('light', val => setLightValue(val));
    socket.on('humidity', val => setHumidityValue(val));
    socket.on('temp', val => setTempValue(val));
    socket.on('ultrasonic', val => setUltrasonicValue(val));
    socket.on('image-desc', val => setImageDescription(val));
    
    return () => {
      socket.off('connect');
      socket.off('light');
      socket.off('humidity');
      socket.off('temp');
      socket.off('ultrasonic');
    };
  }, []);

  const requestLatestValue = (topic) => {
    console.log(`Requesting latest value for topic: ${topic}`);
    socket.emit(`request-${topic}`, "");
  };

  const requestLatestImage = () => {
    console.log(new Date().toLocaleTimeString());
    setImageTimestamp(Date.now());

    // ask backend to download image, and send it to gpt, and get description, and save description in imageDescription
    socket.emit("request-image-desc", `http://192.168.0.106/1600x1200.jpg?nocache=${imageTimestamp}`);
  };

  const sendTextToPico = () => {
    const text = document.getElementById("operatorText").value;
    socket.emit("text", text);
  };

const readImageDescription = () => {
  const utterance = new SpeechSynthesisUtterance(imageDescription);
  speechSynthesis.speak(utterance);
};

// User Interface
  return (
    <div className="App">
      <header className="App-header">
        <img src="/team-name.svg" alt="Team Name" style={{ width: '200px', height: 'auto' }} />
      </header>
      
      <main className="dashboard-container">
        {/* Grid for displaying sensor data cards */}
        <div className="sensor-card-container">
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
          <img 
                key={imageTimestamp}
                src={`http://192.168.0.106/1600x1200.jpg?nocache=${imageTimestamp}`} 
                alt={imageDescription} 
          />

          <h2>Image Description</h2>
          <p>{imageDescription}</p>

          <div className="btn-container">
            <button className="btn-refresh" onClick={() => readImageDescription()}>
              Read Image Description
            </button>
            <button className="btn-refresh" onClick={() => requestLatestImage()}>
              Retrieve Latest Image
            </button>
          </div>
        </div>

        <div className="operator-input">
          <h2>Operator Input</h2>
          <textarea
            id="operatorText"
            rows="4"
            cols="50"
            placeholder="Enter your command here"
          ></textarea>
          <br />
          <button onClick={sendTextToPico}>Send</button>
        </div>

      </main>

      <footer className="App-footer">
        {socketID ? (
          <p>Connected to backend via socket {socketID}</p>
        ) : (
          <p>Not connected to backend</p>
        )
        }
        
      </footer>
    </div>
  );
}

export default App;