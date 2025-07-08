import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const uploadToCloudinary = async (
  localFilePath,
  folderName = "books",
) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
    });

    fs.unlinkSync(localFilePath); // delete local path after file upload

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    fs.unlinkSync(localFilePath); // delete if upload fails
    throw error;
  }
};
