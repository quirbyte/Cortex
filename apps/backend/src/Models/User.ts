import mongoose, { Document, Schema, model } from "mongoose";

export interface InterfaceUser extends Document {
  name: string;
  email: string;
  password: string;
  balance: number; 
}

const UserSchema = new Schema<InterfaceUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true },
);

export const UserModel = model<InterfaceUser>("User", UserSchema);