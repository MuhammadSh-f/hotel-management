import mongoose, { Document, Schema } from "mongoose";

export interface IInvoice extends Document {
  booking: string; // Reference to Booking model
  amount: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "credit_card" | "cash" | "bank_transfer";
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema: Schema<IInvoice> = new Schema<IInvoice>(
  {
    booking: {
      type: String,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "cash", "bank_transfer"],
      default: "credit_card",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);