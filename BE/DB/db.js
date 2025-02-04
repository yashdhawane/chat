import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const uri = "mongodb://localhost:27017/chat"; // Replace with your MongoDB URI
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    if (error) {
        console.error("Error connecting to MongoDB:", error);
      } else {
        console.error("An unknown error occurred while connecting to MongoDB.");
      }
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectToDatabase;