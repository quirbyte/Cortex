import mongoose, { model, Document, Schema } from "mongoose";

export interface InterfaceBooking extends Document {
  user_id: mongoose.Types.ObjectId;
  event_id: mongoose.Types.ObjectId;
  checkedIn: boolean;
}

const BookingSchema = new Schema<InterfaceBooking>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index:true
  },
  event_id: {
    type: Schema.Types.ObjectId,
    ref:"Event",
    required: true,
    index:true
  },
  checkedIn:{
    type:Boolean,
    default: false
  }
},{timestamps:true});

export const BookingModel = model<InterfaceBooking>("Booking",BookingSchema);