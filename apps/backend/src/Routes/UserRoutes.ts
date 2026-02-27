import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { MembershipModel } from "../Models/Membership";
import { BookingModel } from "../Models/Booking";

export const UserRouter = Router();

interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const requiredBody = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email().min(10),
    password: z.string().min(6),
  });
  const { error, success } = requiredBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: error.flatten().fieldErrors,
    });
  }
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashed_pw = await bcrypt.hash(password, 10);
    await UserModel.create({
      name: username,
      email: email,
      password: hashed_pw,
    });
    return res.status(201).json({
      msg: "You are Signed Up successfully!!",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to sign you up!",
    });
  }
});

UserRouter.post("/login", async (req: Request, res: Response) => {
  const requiredBody = z.object({
    email: z.string().email().min(10),
    password: z.string().min(6),
  });
  const { error, success } = requiredBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: error.flatten().fieldErrors,
    });
  }
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(403).json({
        msg: "User does not exist",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({
        msg: "Invalid Credentials!!",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      `${process.env.USER_SECRET}`,
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
    return res.status(500).json({
      msg: "Failed to sign you in!",
    });
  }
});

UserRouter.get("/me", userMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(404).json({
        msg: "Unauthorized User!",
      });
    }
    const user = await UserModel.findOne({
      _id: req.userId,
    }).select("-password");
    return res.json({
      user,
      msg: "Fetched User Details successfully!!",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to Find User Data!!",
    });
  }
});

UserRouter.put("/update", userMiddleware, async (req, res) => {
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

    const updatedUser = await UserModel.findById(req.userId).select(
      "name email",
    );

    return res.json({
      user: updatedUser,
      msg: "Data Updated Successfully!",
    });
  } catch (e) {
    return res.status(500).json({ msg: "Failed to update data!" });
  }
});
UserRouter.delete(
  "/delete",
  userMiddleware,
  async (req: Request, res: Response) => {
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
          return res.status(400).json({
            msg: "Cannot delete account. You are the sole Admin of one or more organizations.",
          });
        }
      }
      await UserModel.deleteOne({ _id: userId }).session(session);
      await MembershipModel.deleteMany({ userId }).session(session);
      await BookingModel.deleteMany({ user_id: userId }).session(session);

      await session.commitTransaction();
      return res.json({ msg: "Account deleted successfully" });
    } catch (e) {
      await session.abortTransaction();
      return res.status(500).json({ msg: "Failed to delete account" });
    } finally {
      session.endSession();
    }
  },
);
