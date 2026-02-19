import { Router, Request, Response } from "express";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { BookingModel } from "../Models/Booking";

export const BookingRouter = Router();

BookingRouter.post(
  "/book",
  userMiddleware,
  (req: Request, res: Response) => {
    
  },
);

BookingRouter.get(
  "/my-tickets",
  userMiddleware,
  (req: Request, res: Response) => {},
);

BookingRouter.get(
  "/event/:eventId",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);

BookingRouter.post(
  "/verify",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
