import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { BookingModel } from "../Models/Booking";
import { EventModel } from "../Models/Event";

export const BookingRouter = Router();

BookingRouter.post(
  "/book",
  userMiddleware,
  (req: Request, res: Response) => {},
);

BookingRouter.get(
  "/my-tickets",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          msg: "Authentication content missing!",
        });
      }
      const userBookings = await BookingModel.find({
        user_id: req.userId,
      })
        .populate({ path: "event_id", select: "name date venue time" })
        .sort({ createdAt: -1 });
      return res.json({
        userBookings,
        msg: "Fetched user bookings successfully!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on fetching user bookings",
      });
    }
  },
);

BookingRouter.get(
  "/event/:eventId",
  userMiddleware,
  TenantMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication/Tenant content missing!",
        });
      }
      const EventFromReq = req.params.eventId;
      if (!Types.ObjectId.isValid(EventFromReq as string)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const queryId = new Types.ObjectId(EventFromReq as string);
      const event = await EventModel.findOne({
        _id: queryId,
        tenantId: req.tenantId,
      });

      if (!event) {
        return res.status(403).json({
          msg: "Access denied: This event does not belong to your tenant account.",
        });
      }
      const bookingDetails = await BookingModel.find({
        event_id: queryId,
      })
        .populate({ path: "user_id", select: "name email" })
        .sort({ createdAt: -1 });
      return res.json({
        bookingDetails,
        msg: "Event booking details fetched successfully!",
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on fetching event bookers!",
      });
    }
  },
);

BookingRouter.post(
  "/verify",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
