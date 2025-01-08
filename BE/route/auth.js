import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  UserModel  from '../models/user.js';
import authMiddleware from '../middleware/authmiddleware.js';

const UserRouter = express.Router();

UserRouter.post('/signup', async (req, res) => {
    const {username, password,gender} = req.body;
    try{
        // Check if user exists
        const user = await UserModel.findOne({username})
        if(!user){
            // Create new user
            const hashpassword=await bcrypt.hash(password,8)
            const newUser = new UserModel({username, password:hashpassword,gender});
            await newUser.save();
            res.send('User created successfully');
        }
        else{
            res.send('User already exists');
        }
    }catch(err){
        res.send('Error: ' + err);
    }
});


UserRouter.post('/login', async (req, res) => {
    const {username,password}=req.body;
    try{
        // Check if user exists
        const user = await UserModel.findOne({username});
        console.log(user)
        if(!user){
            console.log("user not found")
            return res.status(404).json({ message: 'User not found' });
        }
         // Compare the password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            console.log('Invalid username or password');
             return res.status(400).json({ message: "Invalid username or password" });
         }

         const token = jwt.sign({ id: user._id },process.env.JWT, { expiresIn: "1h" });
        
        res.cookie('token', token, { httpOnly: true });
        console.log(token)
         return res.status(200).json({ message: "User signed in successfully", token });
        }catch (error) {
            return res.status(500).json({ message: "Error signing in user", error });
        }
});

UserRouter.get('/gender',authMiddleware, async (req, res) => {
    try {
        console.log("me at gender",req.user)
        const user = await UserModel.findById(req.user);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        console.log("gender ",user.gender)
        res.send({ gender: user.gender });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
});

UserRouter.get('/profile',authMiddleware, async (req, res) => {
    console.log("profile")
    return res.status(200).json({ message: "User profile in successfully" });

})




UserRouter.get('/match', authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const remainingMatches = user.remainingMatches;
        if (remainingMatches === 0) {
            return res.status(400).json({ message: "No remaining matches" });
        }
        const oppositeGender = user.gender === 'male' ? 'female' : 'male';
        const matchUser = await UserModel.findOne({ gender: oppositeGender, remainingMatches: { $ne: 0 } }).exec();
        console.log(matchUser)
        if (!matchUser) {
            return res.status(404).json({ message: "No match found" });
        }
        user.remainingMatches = user.remainingMatches - 1;
        matchUser.remainingMatches = matchUser.remainingMatches - 1;
        await user.save();
        await matchUser.save();
        console.log(matchUser)
        return res.status(200).json({ message: "Match found", match: matchUser });
    } catch (error) {
        console.error("Error finding match:", error);
        return res.status(500).json({ message: "Error finding match", error: error.message || error });
    }
});

export default UserRouter;