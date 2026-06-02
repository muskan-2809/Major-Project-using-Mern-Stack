import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

  cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (filePath) => {
try{
    if(!filePath){
        return null 
    }
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto"})
        try{
        fs.unlinkSync(filePath)
        }catch(err){
            console.log("Error deleting file:", err)
        }
    return uploadResult.secure_url
}catch(error){
    console.log("Cloudinary upload error:", error)

    try{
        if(filePath){
            fs.unlinkSync(filePath)
        }
    }catch(err){
        console.log("Error deleting file:", err)
    }
    throw error;
}
}

export default uploadOnCloudinary