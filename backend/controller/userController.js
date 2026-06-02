import User from "../model/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import Course from "../model/courseModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const user = await User.findById(req.userId).populate("enrolledCourses").select("-password").lean()
    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    res.status(200).json({
      success: true,
      user/*: {
        _id: user._id,
        name: user.name,       
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role,
      }*/
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req,res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const {name, description} = req.body;

        const userId = req.userId;
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        user.name = name || user.name;
        user.description = description || user.description;
        if(req.file){
            const imageUrl = await uploadOnCloudinary(req.file.path);
            user.photoUrl = imageUrl;
        }
        await user.save();
        res.status(200).json({
          success: true,
          user
        });
    } catch (error) {
      console.log( error)
        return res.status(500).json({message: "server error"})
    }
}