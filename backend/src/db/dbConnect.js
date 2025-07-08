import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo db Connected");
  } catch (error) {
    console.log(`DB Connection failed`, error);
    process.exit(1);
  }
};

export default connectDB;
