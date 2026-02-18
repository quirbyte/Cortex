import { Router, Request, Response } from "express";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { EventModel } from "../Models/Event";
import { userMiddleware } from "../Middleware/UserMiddleware";

export const EventRouter = Router();

EventRouter.post(
  "/",
  userMiddleware,
  TenantMiddleware,
  (req: Request, res: Response) => {},
);

EventRouter.get("/", (req: Request, res: Response) => {});

EventRouter.get("/:id", (req: Request, res: Response) => {});

EventRouter.get("/tenant/:tenantId", (req: Request, res: Response) => {});

EventRouter.put(
  "/:id",
  userMiddleware,
  TenantMiddleware,
  (req: Request, res: Response) => {},
);

EventRouter.delete(
  "/:id",
  userMiddleware,
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
