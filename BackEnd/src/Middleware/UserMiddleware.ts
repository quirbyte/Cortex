import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
dotenv.config();

export function userMiddleware(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      msg: "Token does not exist",
    });
  }
  try {
    const decoded_info = jwt.verify(
      token,
      `${process.env.USER_SECRET}`,
    ) as JwtPayload;
    if (decoded_info && typeof decoded_info !== "string") {
      req.userId = decoded_info.id;
      next();
    }
  } catch (e) {
    return res.status(403).json({
      msg: "Token is Invalid!!",
    });
  }
}
