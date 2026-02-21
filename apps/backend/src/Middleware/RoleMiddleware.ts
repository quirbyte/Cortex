import { Request, Response, NextFunction } from "express";
import { UserModel } from "../Models/User";

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.userId);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        msg: "Access Denied: You don't have the required permissions.",
      });
    }
    next();
  };
};
