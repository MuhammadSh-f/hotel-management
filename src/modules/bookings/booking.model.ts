import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: string; // Reference to User model
  room: string; // Reference to Room model
  checkIn: Date;
  checkOut: Date;
  status: 'draft' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema<IBooking>(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    room: {
      type: String,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "confirmed", "cancelled"],
      default: "draft",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);