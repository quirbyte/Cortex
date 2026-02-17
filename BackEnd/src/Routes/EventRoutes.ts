import { Router, Request, Response } from "express";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { EventModel } from "../Models/Event";

export const EventRouter = Router();

EventRouter.post("/", TenantMiddleware, (req: Request, res: Response) => {});

EventRouter.get("/", (req: Request, res: Response) => {});

EventRouter.get("/:id", (req: Request, res: Response) => {});

EventRouter.get("/tenant/:tenantId", (req: Request, res: Response) => {});

EventRouter.put("/:id", TenantMiddleware, (req: Request, res: Response) => {});

EventRouter.delete(
  "/:id",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
