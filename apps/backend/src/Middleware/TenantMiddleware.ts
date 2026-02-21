import { Request, Response } from "express";
import { TenantModel } from "../Models/Tenant";

export async function TenantMiddleware(
  req: Request,
  res: Response,
  next: Function,
) {
  const tenantSlug = req.headers["tenant-slug"] as string;
  if (!tenantSlug) {
    return res.status(404).json({
      msg: "Tenant Context not found!!",
    });
  }
  try {
    const tenant = await TenantModel.findOne({
      slug: tenantSlug.toLowerCase(),
    });

    if (!tenant) {
      return res.status(404).json({ msg: "Tenant not found!!" });
    }

    req.tenantId = tenant._id;
    next();
  } catch (e) {
    return res.status(403).json({ msg: "Invalid Tenant context" });
  }
}
