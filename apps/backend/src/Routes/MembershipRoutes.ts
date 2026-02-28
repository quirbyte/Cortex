import { Router, Request, Response } from "express";
import { authorize } from "../Middleware/RoleMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { MembershipModel } from "../Models/Membership";
import { UserModel } from "../Models/User";
import { Types } from "mongoose";

export const MembershipRouter = Router();

MembershipRouter.post(
  "/add",
  userMiddleware,
  TenantMiddleware,
  authorize(["Admin", "Moderator"]),
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication/Tenant context missing",
        });
      }

      const { email, role } = req.body;

      const requesterMembership = await MembershipModel.findOne({
        userId: req.userId,
        tenantId: req.tenantId
      });

      if (requesterMembership?.role === "Moderator" && role !== "Volunteer") {
        return res.status(403).json({
          msg: "Moderators can only add Volunteers",
        });
      }

      const getUser = await UserModel.findOne({
        email: email,
      });
      if (!getUser) {
        return res.status(404).json({
          msg: "User not found!!",
        });
      }
      const userId = getUser._id;
      const existing = await MembershipModel.findOne({
        userId,
        tenantId: req.tenantId,
      });
      if (existing)
        return res.status(400).json({ msg: "User is already a member!" });
      const newMembership = await MembershipModel.create({
        userId: userId,
        tenantId: req.tenantId,
        role: role,
      });
      return res.json({
        msg: "Member added successfully",
        memberId: newMembership._id,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on adding members!",
      });
    }
  },
);

MembershipRouter.get(
  "/getAllMembers",
  userMiddleware,
  TenantMiddleware,
  authorize(["Admin", "Moderator"]),
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication/Tenant context missing",
        });
      }
      const getAllMembers = await MembershipModel.find({
        tenantId: req.tenantId,
      })
        .populate({ path: "userId", select: "name email" })
        .select("-_id");
      return res.json({
        getAllMembers,
        msg: "All members fetched successfully!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on adding members!",
      });
    }
  },
);

MembershipRouter.delete(
  "/remove",
  userMiddleware,
  TenantMiddleware,
  authorize(["Admin", "Moderator"]),
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication/Tenant context missing",
        });
      }
      const { id } = req.body;

      const requesterMembership = await MembershipModel.findOne({
        userId: req.userId,
        tenantId: req.tenantId
      });

      const targetMembership = await MembershipModel.findOne({
        userId: id,
        tenantId: req.tenantId
      });

      if (!targetMembership) {
        return res.status(404).json({ msg: "Member not found" });
      }

      if (requesterMembership?.role === "Moderator" && targetMembership.role !== "Volunteer") {
        return res.status(403).json({
          msg: "Moderators can only remove Volunteers",
        });
      }

      await MembershipModel.findOneAndDelete({
        userId: id,
        tenantId: req.tenantId,
      });

      return res.json({
        msg: "Membership deleted successfully!!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on adding members!",
      });
    }
  },
);

MembershipRouter.get(
  "/my-organizations",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      const userOrgs = await MembershipModel.find({
        userId: req.userId,
      })
        .populate({ path: "tenantId", select: "name slug" })
        .sort({ createdAt: -1 });

      const formattedOrgs = userOrgs.map((membership) => ({
        membershipId: membership._id,
        role: membership.role,
        tenant: membership.tenantId,
      }));

      return res.json({
        userOrgs: formattedOrgs,
        msg: "Fetched User Org Details successfully",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Failed to Fetch Org Details..",
      });
    }
  },
);

MembershipRouter.get(
  "/my-role/:tenantId",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      const TenantFromReq = req.params.tenantId as string;
      if (!Types.ObjectId.isValid(TenantFromReq)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const tenantId = new Types.ObjectId(TenantFromReq);
      const matchingMembership = await MembershipModel.findOne({
        tenantId,
        userId: req.userId,
      });
      if (!matchingMembership) {
        return res.status(403).json({
          msg: "Membership not found!!",
        });
      }
      const role = matchingMembership.role;
      return res.json({
        role,
        msg: "Role fetched successfully!!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Cant fetch role!!",
      });
    }
  },
);