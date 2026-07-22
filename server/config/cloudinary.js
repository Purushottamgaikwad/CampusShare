import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = "campusshare/misc";

        if (req.originalUrl.includes("/profile/img")) {
            folder = "campusshare/profiles";
        } else if (req.originalUrl.includes("/post")) {
            folder = "campusshare/posts";
        }

        return {
            folder: folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"]
        };
    }
});

export { cloudinary, storage };