import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import "./config/cloudinary.config.js";


dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(() => {
    console.error("MongoDB Connection error ", err);
  });

