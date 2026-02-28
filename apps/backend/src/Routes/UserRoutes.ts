import { Router, Request, Response, RequestHandler } from "express";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { MembershipModel } from "../Models/Membership";
import { BookingModel } from "../Models/Booking";
import { EventModel } from "../Models/Event"; 

dotenv.config();
export const UserRouter = Router();

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email().min(10),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email().min(10),
  password: z.string().min(6),
});

const topupSchema = z.object({
  amount: z.number().min(10).max(100000),
});

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ msg: validation.error.flatten().fieldErrors });
  }

  try {
    const { username, email, password } = validation.data;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashed_pw = await bcrypt.hash(password, 10);
    await UserModel.create({
      name: username,
      email: email,
      password: hashed_pw,
      balance: 0,
    });
    return res.status(201).json({ msg: "You are Signed Up successfully!!" });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to sign you up!" });
  }
});

UserRouter.post("/login", async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ msg: validation.error.flatten().fieldErrors });
  }

  try {
    const { email, password } = validation.data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ msg: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ msg: "Invalid Credentials!!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.USER_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      msg: "You have been signed in successfully!!",
    });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to sign you in!" });
  }
});

UserRouter.get("/me", userMiddleware as RequestHandler, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(404).json({ msg: "Unauthorized User!" });
    }
    const user = await UserModel.findById(req.userId).select("-password");
    return res.json({ user, msg: "Fetched User Details successfully!!" });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to Find User Data!!" });
  }
});

UserRouter.put("/update", userMiddleware as RequestHandler, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ msg: "User not verified!" });
    }

    const { name, email, password } = req.body;
    const updatedData: any = {};

    if (name?.trim()) updatedData.name = name;
    if (email?.trim()) updatedData.email = email;
    if (password?.trim()) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (!Object.keys(updatedData).length) {
      return res.status(400).json({ msg: "Nothing to update!" });
    }

    await UserModel.updateOne({ _id: req.userId }, { $set: updatedData });
    const updatedUser = await UserModel.findById(req.userId).select("name email");

    return res.json({ user: updatedUser, msg: "Data Updated Successfully!" });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to update data!" });
  }
});

UserRouter.delete("/delete", userMiddleware as RequestHandler, async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ msg: "User not verified!!" });
    }

    const personalMemberships = await MembershipModel.find({
      userId,
      role: "Admin",
    });

    for (const membership of personalMemberships) {
      const AdminCount = await MembershipModel.countDocuments({
        tenantId: membership.tenantId,
        role: "Admin",
      });

      if (AdminCount <= 1) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          msg: "Cannot delete account. You are the sole Admin of one or more organizations.",
        });
      }
    }

    const queryId = new Types.ObjectId(userId);
    await UserModel.deleteOne({ _id: queryId }).session(session);
    await MembershipModel.deleteMany({ userId: queryId }).session(session);
    await BookingModel.deleteMany({ user_id: queryId }).session(session);

    await session.commitTransaction();
    return res.json({ msg: "Account deleted successfully" });
  } catch (e) {
    await session.abortTransaction();
    return res.status(500).json({ msg: "Failed to delete account" });
  } finally {
    session.endSession();
  }
});

UserRouter.get("/dashboard-summary", userMiddleware as RequestHandler, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [bookingsCount, user, recentBookings, monthlyActivity] = await Promise.all([
      BookingModel.countDocuments({ user_id: userId }),
      UserModel.findById(userId).select("balance"),
      BookingModel.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate({ path: "event_id", model: EventModel }),
      BookingModel.countDocuments({ 
        user_id: userId, 
        createdAt: { $gte: thirtyDaysAgo } 
      })
    ]);

    const nextBooking = await BookingModel.findOne({ user_id: userId })
      .populate({
        path: "event_id",
        model: EventModel,
        match: { date: { $gte: new Date() } }
      })
      .sort({ "event_id.date": 1 });

    let daysToNextEvent = 0;
    if (nextBooking && (nextBooking.event_id as any)?.date) {
      const eventDate = new Date((nextBooking.event_id as any).date);
      const diffTime = eventDate.getTime() - new Date().getTime();
      daysToNextEvent = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const recentActivity = recentBookings.map((booking: any) => ({
      id: booking._id,
      title: booking.event_id?.event_name || "System Event",
      location: booking.event_id?.venue || "Main Grid",
      amount: booking.event_id?.price || 0,
      type: 'debit'
    }));

    return res.json({
      stats: {
        totalBookings: bookingsCount,
        balance: user?.balance || 0,
        engagement: Math.min(monthlyActivity * 20 + 10, 100), // Base 10% + 20% per booking
        daysToNextEvent
      },
      recentActivity
    });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to fetch dashboard summary" });
  }
});

UserRouter.post("/wallet/topup", userMiddleware as RequestHandler, async (req: Request, res: Response) => {
  const validation = topupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ msg: "Amount must be a positive number" });
  }

  try {
    const { amount } = validation.data;
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $inc: { balance: amount } },
      { new: true }
    ).select("balance");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({ 
      balance: user.balance, 
      msg: `₹${amount} added successfully!` 
    });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to process top-up" });
  }
});