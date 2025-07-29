// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require("express");
const http = require("http");
const MQTT = require("mqtt");
const { Server } = require("socket.io");

const { exec } = require('child_process');
const { stdout } = require('process');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server (for frontend communication)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to the MQTT broker (for pico communication) using credentials from .env
const client = MQTT.connect(process.env.CONNECT_URL, {
  clientId: "frontend",
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  clean: true,
  connectTimeout: 3000,    
  reconnectPeriod: 10000,
  rejectUnauthorized: false
});

// When MQTT broker connection is established,
// subscribe to relevant topics
client.on("connect", () => {
  console.log("MQTT connected!");
  client.subscribe(["temp", "humidity", "light", "ultrasonic"], (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to all topics.");
    }
  });
});

// Set up handler for incoming MQTT messages
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

    default:
      console.warn("Unhandled topic:", topic);
  }
});

// Set up socket subscriptions and handlers for incoming frontend requests
io.on("connection", (socket) => {

  // Forward sensor data requests to MQTT broker

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

  socket.on('request-ultrasonic', (message) => {
    console.log('Backend received ultrasonic value request from frontend. Forwarding to MQTT broker...', message);
    client.publish("request-ultrasonic", message.toString());
  });

// When frontend requests latest image,
// 1. Run python script that:
//  1.1 Downloads latest image into frontend/src/image.jpg
//  1.2 Converts the image to bytes and requests ChatGPT to describe it via an API request
//  1.3 Prints (returns) the result to the console
// 2. Forward the result to the frontend via socket
  socket.on('request-image-desc', (message) => {
    console.log('Backend received image description request from frontend. Running: ', `venv/bin/python receive.py ${message}`);
    
    exec(`venv/bin/python receive.py ${message}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    console.log(`Python output: ${stdout}`);

    io.emit('image-desc', stdout);
    });
  });

  // Forward incoming frontend text data to pico (for display on device)
  socket.on('text', (message) => {
    console.log("Backend received text from frontend. Forwarding to Pico...");
    client.publish('text', message.toString());
  })

});



// Start the HTTP server on port 8000
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});