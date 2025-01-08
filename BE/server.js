import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import UserRouter from './route/auth.js';
import connectToDatabase from './DB/db.js';
dotenv.config(); 
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors())
app.use('/user', UserRouter);

connectToDatabase().then(() => {
    console.log("DB connected");
}).catch((error) => {
    console.error("Error connecting to the database:", error);
});


// Create HTTP server
const server = http.createServer(app);
// Create WebSocket server
const wss = new WebSocketServer({ server });

const waitingUsers = { 
    male: [], 
    female: [] 
  };

wss.on('connection', (ws) => {
    console.log('WebSocket connected');
    ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log(data);
    if (data.type === 'joinQueue') {
      const { gender } = data; // Gender from frontend
      matchUser(ws, gender);
    }
  });

  ws.on('close', () => {
    removeUser(ws); // Cleanup when user disconnects
  });
});

function matchUser(ws, gender) {
  const oppositeGender = gender === 'male' ? 'female' : 'male';
    
  if (waitingUsers[oppositeGender].length > 0) {
    // Match found
    const partner = waitingUsers[oppositeGender].shift();
    console.log(partner)
    if (partner) {
    //   startChat(ws, partner);
      console.log("start chat started")
    }
  } else {
    // No match, add user to waiting list
    waitingUsers[gender].push(ws);
  }
}

function startChat(user1, user2) {
  user1.send(JSON.stringify({ type: 'matchFound' }));
  user2.send(JSON.stringify({ type: 'matchFound' }));

  // Handle messages
  user1.on('message', (msg) => user2.send(msg));
  user2.on('message', (msg) => user1.send(msg));

  // Handle disconnection
  user1.on('close', () => user2.close());
  user2.on('close', () => user1.close());
}

function removeUser(ws) {
  Object.keys(waitingUsers).forEach((key) => {
    waitingUsers[key] = waitingUsers[key].filter((u) => u !== ws);
  });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});