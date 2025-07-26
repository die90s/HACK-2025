// Load environment variables from .env file
require('dotenv').config();
const { exec } = require('child_process');

// Import required modules
const express = require("express");
const http = require("http");
const MQTT = require("mqtt");
const { Server } = require("socket.io");

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server with CORS settings to allow any origin
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to the MQTT broker using credentials from .env
const client = MQTT.connect(process.env.CONNECT_URL, {
  clientId: "frontend",                // Unique ID for this MQTT client
  username: process.env.MQTT_USER,    // MQTT username from environment
  password: process.env.MQTT_PASS,    // MQTT password from environment
  clean: true,                        // Start with a clean session
  connectTimeout: 3000,               // Connection timeout (in ms)
  reconnectPeriod: 10000,             // Reconnect every 10s if disconnected
  rejectUnauthorized: false           // Allow self-signed certs (if using TLS)
});

// Handle incoming WebSocket connections from frontend (forward them to MQTT broker)
io.on("connection", (socket) => {
  socket.on('request-light', (message) => {
    console.log('Backend received light value request from frontend. Forwarding to MQTT broker...', message);
    client.publish("request-light", message.toString());
  });

  socket.on('request-humidity', (message) => {
    console.log('Backend received humidity value request from frontend. Forwarding to MQTT broker...', message);
    client.publish("request-humidity", message.toString());
  });

  socket.on('request-temp', (message) => {
    console.log('Backend received temp value request from frontend. Forwarding to MQTT broker...', message);
    client.publish("request-temp", message.toString());
  });

  socket.on('request-humidity', (message) => {
    console.log('Backend received ultrasonic value request from frontend. Forwarding to MQTT broker...', message);
    client.publish("request-ultrasonic", message.toString());
  });

  socket.on('request-image-desc', (message) => {
    console.log('Backend received image description request from frontend. Forwarding to MQTT broker...', message);
    


    exec('python3 receive.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`Output: ${stdout}`);
    });
    
    client.publish("request-image-desc", message.toString());
  });

});

// When connected to MQTT broker, subscribe to relevant topics
client.on("connect", () => {
  console.log("MQTT connected!");
  client.subscribe(["temp", "humidity", "light", "ultrasonic", "image-desc"], (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to all topics.");
    }
  });
});

// Handle incoming MQTT messages
client.on("message", (topic, payload) => {
  const msg = payload.toString();

  console.log(`Received topic: [${topic}], payload: ${msg}`);

  switch (topic) {
    case "temp":
    case "light":
    case "humidity":
    case "ultrasonic":
      console.log(`Emitted ${topic}: ${msg}`);
      io.emit(topic, msg); // Just forward raw string
      break;

    case "image-desc":
      try {
        const imageData = JSON.parse(msg);
        io.emit("image-desc", imageData); // Forward parsed imag-desc object
      } catch (err) {
        console.error("Failed to parse image-description object:", err);
      }
      break;

    default:
      console.warn("Unhandled topic:", topic);
  }
});

// Start the HTTP server on port 8000
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});