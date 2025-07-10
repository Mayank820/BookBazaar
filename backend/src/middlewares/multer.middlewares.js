// import multer from "multer";
// import path from "path";

// const imagePath = path.join(process.cwd(), "public", "uploads");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, imagePath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const imageFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if ([".jpg", ".jpeg", ".png"].includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// export const upload = multer({ storage, fileFilter: imageFilter });

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {cloudinary} from "../config/cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "BookBazaar/books",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const upload = multer({ storage });
