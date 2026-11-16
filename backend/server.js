
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SkyCast Backend is running");
});

app.use("/api/weather", weatherRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SkyCast server running on port ${PORT}`);
    });
};

startServer();