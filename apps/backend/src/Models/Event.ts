import mongoose, { Document, Schema, model } from "mongoose";

export const DEFAULT_EVENT_BANNER = "https://res.cloudinary.com/dh1h5jyki/image/upload/v1772260262/event_wgu32k.jpg";

export interface InterfaceEvent extends Document {
  name: string;
  tenantId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  venue: string;
  imageRef: string;
  ticketDetails: {
    price: number;
    total: number;
    sold: number;
  };
  isDeleted: boolean;
}

const EventSchema = new Schema<InterfaceEvent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    imageRef: {
      type: String,
      default: DEFAULT_EVENT_BANNER,
    },
    ticketDetails: {
      price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      sold: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

export const EventModel = model<InterfaceEvent>("Event", EventSchema);