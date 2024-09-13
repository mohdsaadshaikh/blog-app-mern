import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB server");
  } catch (error) {
    console.log(`DB connection Failed:: ${error}`);
    process.exit(1);
  }
};

export default dbConnection;
