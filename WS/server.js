// Server-side code (Node.js/Express)
import { WebSocketServer } from 'ws';
import UserModel from './models/UserModel.js'; // Assuming you have a UserModel
import connectToDatabase from './DB/db.js';

connectToDatabase().then(() => {
    console.log("DB connected");
}).catch((error) => {
    console.error("Error connecting to the database:", error);
});

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.action === 'match') {
      try {
        const user = await UserModel.findById(data.userId); // Assuming you send userId in the message
        if (!user) {
          ws.send(JSON.stringify({ message: 'User not found' }));
          return;
        }

        const remainingMatches = user.remainingMatches;
        if (remainingMatches === 0) {
          ws.send(JSON.stringify({ message: 'No remaining matches' }));
          return;
        }

        const oppositeGender = user.gender === 'male' ? 'female' : 'male';
        const matchUser = await UserModel.findOne({ gender: oppositeGender, remainingMatches: { $ne: 0 } }).exec();
        if (!matchUser) {
          ws.send(JSON.stringify({ message: 'No match found' }));
          return;
        }

        user.remainingMatches -= 1;
        matchUser.remainingMatches -= 1;
        await user.save();
        await matchUser.save();

        ws.send(JSON.stringify({ message: 'Match found', match: matchUser }));
      } catch (error) {
        console.error('Error finding match:', error);
        ws.send(JSON.stringify({ message: 'Error finding match', error: error.message || error }));
      }
    }
  });
});