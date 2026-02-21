import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { TenantModel } from "../Models/Tenant";
import { authorize } from "../Middleware/RoleMiddleware";
import { MembershipModel } from "../Models/Membership";

export const TenantRouter = Router();

interface TenantUpdate {
  name?: string;
  slug?: string;
}

TenantRouter.post(
  "/create",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      let { name, slug } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ msg: "Name and slug required" });
      }
      slug = slug.trim().toLowerCase().replace(/\s+/g, "-");
      const sameSlug = await TenantModel.findOne({
        slug: slug,
      });
      if (sameSlug) {
        return res.status(409).json({
          msg: "Slug already exists!!",
        });
      }
      const newTenant = await TenantModel.create({
        name: name,
        slug: slug,
      });

      await MembershipModel.create({
        userId: req.userId,
        tenantId: newTenant._id,
        role: "admin",
      });

      return res.json({
        msg: "Created Tenant successfully!!",
        tenantId: newTenant._id,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Failed to Create Tenant",
      });
    }
  },
);



TenantRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const slugObj = await TenantModel.findOne({
      slug: slug.toLowerCase(),
    }).select("name slug");
    if (!slugObj) {
      return res.status(404).json({
        msg: "Slug Not Found!!",
      });
    }
    return res.json({
      slugObj,
      msg: "Fetched Slug Details successfully!",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to Fetch Slug Details..",
    });
  }
});

TenantRouter.put(
  "/update/:id",
  userMiddleware,
  TenantMiddleware,
  authorize(["admin", "moderator"]),
  async (req: Request, res: Response) => {
    try {
      if (!req.tenantId || !req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      const TenantFromReq = req.params.id;
      let { updatedName, updatedSlug } = req.body;
      const updatedData: TenantUpdate = {};
      if (updatedName && updatedName.trim() !== "") {
        updatedData.name = updatedName;
      }
      if (updatedSlug && updatedSlug.trim() !== "") {
        updatedSlug = updatedSlug.trim().toLowerCase().replace(/\s+/g, "-");
        const existingSlug = await TenantModel.findOne({
          slug: updatedSlug,
        });
        if (existingSlug && existingSlug._id.toString() !== TenantFromReq) {
          return res.status(400).json({
            msg: "This slug is already taken by another organization!",
          });
        }
        updatedData.slug = updatedSlug;
      }
      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({
          msg: "Nothing to update!!",
        });
      }
      if (!Types.ObjectId.isValid(TenantFromReq as string)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const queryId = new Types.ObjectId(TenantFromReq as string);
      const result = await TenantModel.updateOne(
        {
          _id: queryId,
        },
        {
          $set: updatedData,
        },
      );
      if (result.matchedCount === 0) {
        return res.status(403).json({
          msg: "Tenant not found or you don't have permission to update it.",
        });
      }

      return res.json({
        msg: "Tenant updated successfully!!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Failed to Update Tenant Details..",
      });
    }
  },
);

TenantRouter.get("/public/:slug", async (req: Request, res: Response) => {
  try {
    const tenant = await TenantModel.findOne({
      slug: req.params.slug as string,
    }).select("name slug");
    if (!tenant) return res.status(404).json({ msg: "Tenant not found" });
    return res.json(tenant);
  } catch (e) {
    return res.status(500).json({ msg: "Error fetching public tenant info" });
  }
});

TenantRouter.delete(
  "/delete/:id",
  userMiddleware,
  TenantMiddleware,
  authorize(["admin"]),
  async (req: Request, res: Response) => {
    try {
      if (!req.tenantId || !req.userId) {
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      const TenantFromReq = req.params.id;
      if (!Types.ObjectId.isValid(TenantFromReq as string)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const queryId = new Types.ObjectId(TenantFromReq as string);
      await TenantModel.deleteOne({
        _id: queryId,
      });
      await MembershipModel.deleteMany({
        tenantId: queryId,
      });
      return res.json({
        msg: "Tenant deleted successfully!!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Failed to Delete Tenant..",
      });
    }
  },
);
