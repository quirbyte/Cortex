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