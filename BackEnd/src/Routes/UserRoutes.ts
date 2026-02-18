import { Router, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User";
import { userMiddleware } from "../Middleware/UserMiddleware";

export const UserRouter = Router();

interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

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

UserRouter.get("/me", userMiddleware,async (req: Request, res: Response) => {
  try{
    if(!req.userId){
      return res.status(404).json({
        msg: "Unauthorized User!"
      });
    }
    const user = await UserModel.findOne({
      _id:req.userId
    }).select("-password");
    return res.json({
      user,
      msg: "Fetched User Details successfully!!"
    })
  }catch(e){
    return res.status(500).json({
      msg: "Failed to Find User Data!!"
    })
  }
});

UserRouter.put(
  "/update",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      const { updatedName, updatedEmail, updatedPasswd } = req.body;
      const updatedData: UserUpdate = {};
      if (updatedName && updatedName.trim() !== "") {
        updatedData.name = updatedName;
      }
      if (updatedEmail && updatedEmail.trim() !== "") {
        updatedData.email = updatedEmail;
      }
      if (updatedPasswd && updatedPasswd.trim() !== "") {
        const hashed_pw = await bcrypt.hash(updatedPasswd, 10);
        updatedData.password = hashed_pw;
      }
      if (Object.keys(updatedData).length > 0) {
        await UserModel.updateOne(
          {
            _id: req.userId,
          },
          {
            $set: updatedData,
          },
        );
        return res.json({
          msg: "Data Updated Successfully!!",
        });
      } else {
        return res.status(404).json({
          msg: "Nothing to update!!",
        });
      }
    } catch (e) {
      return res.status(500).json({
        msg: "Failed to Update data!!",
      });
    }
  },
);
