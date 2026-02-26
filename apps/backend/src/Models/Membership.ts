import mongoose, { Document, Schema, model } from "mongoose";

export interface InterfaceMembership extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  role: "Admin" | "Moderator" | "Volunteer";
}

const MembershipSchema = new Schema<InterfaceMembership>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["Admin", "User","Volunteer"], default: "Volunteer" },
  },
  { timestamps: true },
);

MembershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export const MembershipModel = model<InterfaceMembership>(
  "Membership",
  MembershipSchema,
);
