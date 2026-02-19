import { Router, Request, Response } from "express";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { EventModel } from "../Models/Event";
import { userMiddleware } from "../Middleware/UserMiddleware";
import z from "zod";

export const EventRouter = Router();

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(?:AM|PM)$/i;

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
  time: z.string().regex(timeRegex, "Invalid time format (Use HH:MM AM/PM)"),
  price: z.number().min(0),
  venue: z.string().min(3).max(255),
  total: z.number().int().min(1),
});

EventRouter.post(
  "/",
  userMiddleware,
  TenantMiddleware,
  async (req: Request, res: Response) => {
    if (!req.userId || !req.tenantId) {
      return res
        .status(401)
        .json({ msg: "Authentication/Tenant context missing" });
    }

    try {
      const validation = createEventSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          msg: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const { name, venue, date, time, price, total } = validation.data;

      const newEvent = await EventModel.create({
        name,
        tenantId: req.tenantId,
        date,
        time,
        venue,
        ticketDetails: {
          price,
          total,
          sold: 0,
        },
      });

      return res.status(201).json({
        msg: "Event created successfully!!",
        eventId: newEvent._id,
      });
    } catch (e) {
      return res.status(500).json({
        msg: "Internal server error during event creation",
      });
    }
  },
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
    const filter = { date: { $gte: today } };

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
    return res.status(500).json({
      msg: "Internal server error during event fetch",
    });
  }
});

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
