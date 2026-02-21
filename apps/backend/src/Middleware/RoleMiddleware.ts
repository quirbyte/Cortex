import { MembershipModel } from "../Models/Membership";
import { Request, Response } from "express";

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication or Tenant context missing.",
        });
      }
      const membership = await MembershipModel.findOne({
        userId: req.userId,
        tenantId: req.tenantId,
      });

      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({
          msg: "Access Denied: You are not an admin of this organization.",
        });
      }

      next();
    } catch (e) {
      res.status(500).json({ msg: "Error checking permissions" });
    }
  };
};
