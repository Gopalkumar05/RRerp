import mongoose from "mongoose";
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    code: { type: String, required: true, unique: true, default: generateCode } // Unique teacher code
   
},{timestamps:true});
export const User = mongoose.model('User', userSchema);
