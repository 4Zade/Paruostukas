import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';

// Ensure the images directory exists
const imagesFolder = path.join(__dirname, '../images');
if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
}

// Configure Multer
const storage = multer.memoryStorage(); // Use memory storage for processing with sharp
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
    },
});

// Middleware to handle single image uploads
export const uploadMiddleware = upload.single('image');

// Middleware to convert and save as WebP
export const imageHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        next();
        return;
    }

    try {
        // Generate unique filename for the .webp file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const webpFilename = `image-${uniqueSuffix}.webp`;
        const webpFilePath = path.join(imagesFolder, webpFilename);

        // Convert image to WebP format and save
        await sharp(req.file.buffer)
            .webp({ quality: 80 }) // Adjust quality as needed
            .toFile(webpFilePath);

        // Construct the public URL
        const imageUrl = `/images/${webpFilename}`;

        // Attach image URL to the request for the next middleware or handler
        req.body.imageUrl = imageUrl;
        next();
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ message: 'Failed to process the image.' });
    }
};