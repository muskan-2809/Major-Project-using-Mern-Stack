import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import genToken from "../config/token.js";
import sendMail from "../config/sendmail.js";

//for signup
export const signUp = async (req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter Valid email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong Password"})
        }
        let hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password:hashPassword,
            role
        })
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`SignUp error ${error}`})
    }
}

//for login
export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json({message:"Login Success",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                photoUrl:user.photoUrl
            }
        })
    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}

//for logout
export const logout = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout Success"})
    } catch (error) {
        return res.status(500).json({message:`Logout error ${error}`})
    }
}

//send OTP
export const sendOTP = async (req,res)=>{
try{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    } 
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5*60*1000; //change to milliseconds
    user.isOtpVerified = false;
    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({message:"OTP sent successfully"})
}catch(error){
    return res.status(500).json({message:`Send OTP error ${error}`})
}
}

//verify OTP
export const verifyOTP = async (req,res)=>{
    try {
        const {email,otp} = req.body;
        const user = await User.findOne({email})
        if(!user || user.resetOtp != otp || user.otpExpiry < Date.now()){
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(200).json({message:"OTP verified successfully"})
    } catch (error) {
        return res.status(500).json({message:`Verify OTP error ${error}`})
    }   
}

//reset Password
export const resetPassword = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"OTP verification required"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({message:"Password reset successfully"})
    } catch (error) {
        return res.status(500).json({message:`Reset Password error ${error}`})
    }
}

export const googleAuth = async (req,res)=>{
    try {
        const {name,email,role} = req.body;
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,
                email,
                role,
                password:"google-auth-user"
            })
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Google Auth error ${error}`})
    }
}
