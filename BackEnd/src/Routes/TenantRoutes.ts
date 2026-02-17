import { Router, Request, Response } from "express";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { TenantModel } from "../Models/Tenant";

const TenantRouter = Router();

TenantRouter.post(
  "/create",
  userMiddleware,
  (req: Request, res: Response) => {},
);

TenantRouter.get(
  "/my-organizations",
  userMiddleware,
  (req: Request, res: Response) => {},
);

TenantRouter.get("/:slug", (req: Request, res: Response) => {});

TenantRouter.patch(
  "/update/:id",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
