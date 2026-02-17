import mongoose, { model, Document, Schema } from "mongoose";

export interface InterfaceBooking extends Document {
  user_id: mongoose.Types.ObjectId;
  event_id: mongoose.Types.ObjectId;
}

const BookingSchema = new Schema<InterfaceBooking>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: Schema.Types.ObjectId,
    ref:"Event",
    required: true,
  },
},{timestamps:true});

export const BookingModel = model<InterfaceBooking>("Booking",BookingSchema);