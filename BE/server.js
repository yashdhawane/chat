import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});