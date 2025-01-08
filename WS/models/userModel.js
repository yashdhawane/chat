import  { Schema,model } from "mongoose";

const UserSchema=new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type:String, required:true},
    remainingMatches: { type: Number, default: 5 },
    subscriptionStatus: { type: String, default: 'trial' }
});


const UserModel = model('users', UserSchema); 

export default UserModel;