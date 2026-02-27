import { Router, Request, Response } from "express";
import mongoose from "mongoose";
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

UserRouter.put("/update", userMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ msg: "User not verified!" });
    }

    const { name, email, password } = req.body;
    const updatedData: UserUpdate = {};

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