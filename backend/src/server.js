import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
await connectDB();
app.listen(port, () => console.log(`PulseHR API listening on port ${port}`));
