import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { BookingModel, InterfaceBooking } from "../Models/Booking";
import { EventModel, InterfaceEvent } from "../Models/Event";

export const BookingRouter = Router();

interface PopulatedBooking extends Omit<InterfaceBooking, "event_id"> {
  event_id: InterfaceEvent;
}

BookingRouter.post(
  "/book",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          msg: "Authentication content missing!",
        });
      }
      const { eventId } = req.body;
      const matchingEvent = await EventModel.findOne({
        _id: eventId,
        isDeleted: false,
      });
      if (!matchingEvent) {
        return res.status(400).json({
          msg: "Event does not exist!!",
        });
      }
      if (
        matchingEvent.ticketDetails.total <= matchingEvent.ticketDetails.sold
      ) {
        return res.status(400).json({
          msg: "No More Spots Left for the event!!",
        });
      }
      const updateResult = await EventModel.updateOne(
        {
          _id: eventId,
          "ticketDetails.sold": { $lt: matchingEvent.ticketDetails.total },
        },
        { $inc: { "ticketDetails.sold": 1 } },
      );
      if (updateResult.modifiedCount === 0) {
        return res.status(400).json({
          msg: "Event just filled up! Please try another event.",
        });
      }
      const newBooking = await BookingModel.create({
        user_id: req.userId,
        event_id: matchingEvent._id,
        checkedIn: false,
      });
      return res.json({
        msg: "Event Booked successfully!!",
        booking_id: newBooking._id,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error on ticket booking!!",
      });
    }
  },
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
  userMiddleware,
  TenantMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({
          msg: "Authentication/Tenant content missing!",
        });
      }

      const { bookingId } = req.body;
      if (!Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ msg: "Invalid Ticket format" });
      }

      const queryBookingId = new Types.ObjectId(bookingId);
      const booking = (await BookingModel.findById(queryBookingId).populate(
        "event_id",
      )) as PopulatedBooking | null;

      if (!booking) {
        return res.status(404).json({
          msg: "Ticket not found!!",
        });
      }

      const event = booking.event_id;

      if (event.tenantId.toString() !== req.tenantId.toString()) {
        return res.status(403).json({
          msg: "Ticket not of this event!!",
        });
      }

      if (booking.checkedIn) {
        return res.status(400).json({
          msg: "ALREADY USED: This ticket was scanned earlier!",
        });
      }

      booking.checkedIn = true;
      await booking.save();

      return res.json({
        msg: "ACCESS GRANTED!!",
        attendee: booking.user_id,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Verification failed!!",
      });
    }
  },
);
