import { Router, Request, Response, RequestHandler } from "express";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { EventModel, DEFAULT_EVENT_BANNER } from "../Models/Event";
import { userMiddleware } from "../Middleware/UserMiddleware";
import z from "zod";
import { Types } from "mongoose";
import { authorize } from "../Middleware/RoleMiddleware";
import { upload } from "../config/cloudinary";

export const EventRouter = Router();

const createEventSchema = z.object({
  name: z.string().min(3).max(100),
  date: z.coerce.date().refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data >= today;
    },
    { message: "Event date must be today or in the future" },
  ),
  time: z.string().regex(
    /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$|^(0?[1-9]|1[0-2]):[0-5]\d\s?(?:AM|PM)$/i, 
    "Invalid time format"
  ),
  price: z.coerce.number().min(0),
  venue: z.string().min(3).max(255),
  total: z.coerce.number().int().min(1),
});

EventRouter.get(
  "/tenant-events",
  userMiddleware as RequestHandler,
  TenantMiddleware as RequestHandler,
  authorize(["Admin", "Moderator", "Volunteer"]) as RequestHandler,
  async (req: Request, res: Response) => {
    try {
      if (!req.tenantId) {
        return res.status(401).json({ msg: "Tenant context missing" });
      }

      const events = await EventModel.find({
        tenantId: req.tenantId,
        isDeleted: { $ne: true },
      }).sort({ date: 1 });

      return res.json({ events, msg: "Tenant Events fetched successfully" });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

EventRouter.post(
  "/",
  userMiddleware as RequestHandler,
  TenantMiddleware as RequestHandler,
  authorize(["Admin", "Moderator"]) as RequestHandler,
  (req: any, res: any, next: any) => {
    upload.single("banner")(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({
          msg: "File upload failed",
          error: err.message
        });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.tenantId) {
        return res.status(400).json({ msg: "Tenant ID is required" });
      }

      const validation = createEventSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          msg: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const { name, venue, date, time, price, total } = validation.data;

      const eventData: any = {
        name,
        tenantId: req.tenantId,
        date,
        time,
        venue,
        imageRef: req.file ? req.file.path : DEFAULT_EVENT_BANNER,
        ticketDetails: {
          price,
          total,
          sold: 0,
        },
        isDeleted: false,
      };

      const newEvent = await EventModel.create(eventData);

      return res.status(201).json({ 
        msg: "Event created successfully!!", 
        eventId: (newEvent as any)._id 
      });
    } catch (e: any) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

EventRouter.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 10),
    );
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filter = { date: { $gte: today }, isDeleted: { $ne: true } };

    const [events, totalEvents] = await Promise.all([
      EventModel.find(filter)
        .select("-tenantId")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit),
      EventModel.countDocuments(filter),
    ]);

    return res.json({
      events,
      pagination: {
        totalEvents,
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
      },
      msg: "Events fetched successfully!!",
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

EventRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID format" });
    }
    const queryId = new Types.ObjectId(id);
    const eventDetails = await EventModel.findOne({
      _id: queryId,
      isDeleted: { $ne: true },
    }).select("-tenantId");

    if (!eventDetails) {
      return res.status(404).json({ msg: "Event not found!!" });
    }
    return res.json({
      eventDetails,
      msg: "Event Details fetched successfully!!",
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

EventRouter.put(
  "/:id",
  userMiddleware as RequestHandler,
  TenantMiddleware as RequestHandler,
  authorize(["Admin", "Moderator"]) as RequestHandler,
  (req: any, res: any, next: any) => {
    upload.single("banner")(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({
          msg: "File upload failed",
          error: err.message
        });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({ msg: "Authentication/Tenant context missing" });
      }

      const id = req.params.id as string;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const validation = createEventSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          msg: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const queryId = new Types.ObjectId(id);
      const updateData: Record<string, any> = { ...validation.data };

      if (req.file) {
        updateData.imageRef = req.file.path;
      }

      if (updateData.price !== undefined) {
        updateData["ticketDetails.price"] = updateData.price;
        delete updateData.price;
      }
      if (updateData.total !== undefined) {
        updateData["ticketDetails.total"] = updateData.total;
        delete updateData.total;
      }

      const updatedEvent = await EventModel.findOneAndUpdate(
        { _id: queryId, tenantId: req.tenantId },
        { $set: updateData },
        { new: true },
      ).select("-tenantId");

      if (!updatedEvent) {
        return res.status(404).json({ msg: "Event not found or unauthorized" });
      }
      return res.json({
        msg: "Event updated successfully!",
        updated_event: updatedEvent,
      });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

EventRouter.delete(
  "/:id",
  userMiddleware as RequestHandler,
  TenantMiddleware as RequestHandler,
  authorize(["Admin", "Moderator"]) as RequestHandler,
  async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.tenantId) {
        return res.status(401).json({ msg: "Authentication/Tenant context missing!" });
      }
      const id = req.params.id as string;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const queryId = new Types.ObjectId(id);
      const deletedEvent = await EventModel.findOneAndUpdate(
        { _id: queryId, tenantId: req.tenantId },
        { $set: { isDeleted: true } },
      );
      if (!deletedEvent) {
        return res.status(404).json({ msg: "Event not found!!" });
      }
      return res.json({ msg: "Event deleted successfully!!" });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);