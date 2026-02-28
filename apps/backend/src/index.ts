import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { BookingRouter } from "./Routes/BookingRoutes";
import { EventRouter } from "./Routes/EventRoutes";
import { UserRouter } from "./Routes/UserRoutes";
import { TenantRouter } from "./Routes/TenantRoutes";
import { MembershipRouter } from "./Routes/MembershipRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://cortex-quirbyte.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "token", "tenant-slug"],
  credentials: true
}));

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tenant", TenantRouter);
app.use("/api/v1/events", EventRouter);
app.use("/api/v1/bookings", BookingRouter);
app.use("/api/v1/memberships",MembershipRouter);

const USER_SECRET = process.env.USER_SECRET;
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "";

const startServer = async () => {
  try {
    if (!MONGO_URL || !USER_SECRET) {
      throw new Error("Mongo Url or jwt secret missing!!");
    }

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Cortex server is running on port ${PORT}`);
    });

    await mongoose.connect(MONGO_URL);
    console.log("Connected to Db....");

  } catch (e) {
    console.error("❌ Startup failed:", e);
    process.exit(1);
  }
};

startServer();