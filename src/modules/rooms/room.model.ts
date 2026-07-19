import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  roomNum: number;
  roomType: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  customers: string[];
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    roomNum: { type: Number, required: true, unique: true },
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    customers: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Room = mongoose.model<IRoom>("Room", roomSchema);
