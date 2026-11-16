
import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
    try {
       
        dns.setServers(["8.8.8.8", "8.8.4.4"]);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;