import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { BookingRouter } from "./Routes/BookingRoutes";
import { EventRouter } from "./Routes/EventRoutes";
import { UserRouter } from "./Routes/UserRoutes";
import { TenantRouter } from "./Routes/TenantRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tenant", TenantRouter);
app.use("/api/v1/events", EventRouter);
app.use("/api/v1/bookings", BookingRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "";

const startServer = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("Mongo Url mssing!!");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to Db....");

    app.listen(PORT, () => {
      console.log(`Cortex server is ruuning on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Database connection failed:", e);
    process.exit(1);
  }
};

startServer();