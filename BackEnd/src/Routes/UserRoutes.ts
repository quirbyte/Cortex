import { Router, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User";
import { userMiddleware } from "../Middleware/UserMiddleware";

export const UserRouter = Router();

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const requiredBody = z.object({
    username: z.string().min(5).max(20),
    email: z.email().min(10),
    password: z.string().min(6),
  });
  const { error, success } = requiredBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: error,
    });
  }
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashed_pw = await bcrypt.hash(password, 5);
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

UserRouter.post("/signin", async (req: Request, res: Response) => {
  const requiredBody = z.object({
    email: z.email().min(10),
    password: z.string().min(6),
  });
  const { error, success } = requiredBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: error,
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
      msg: "You have been signed in successfully!!",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to sign you in!",
    });
  }
});

UserRouter.get("/me", userMiddleware, (req: Request, res: Response) => {});

UserRouter.put("/update", userMiddleware, (req: Request, res: Response) => {});
