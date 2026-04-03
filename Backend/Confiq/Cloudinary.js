import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
const UploadOnCloudinary = async (filepath) => {
    cloudinary.config({
        api_key: process.env.CLOUD_API,
        api_secret: process.env.CLOUD_SECRET,
        cloud_name: process.env.CLOUD_NAME
    })

    try {
        const uploadResult = await cloudinary.uploader.upload(filepath);
        fs.unlinkSync(filepath)
        return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filepath)
        console.log(error);

    }
}

export default UploadOnCloudinary