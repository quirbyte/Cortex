import * as express from "express";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      tenantId?: mongoose.Types.ObjectId;
    }
  }
}
