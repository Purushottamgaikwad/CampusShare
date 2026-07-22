import { cloudinary } from '../config/cloudinary.js';

export function uploadToCloudinary(fileBuffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder, allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
}