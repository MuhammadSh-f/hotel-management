import { z } from "zod";

export const generateInvoiceSchema = z.object({
  bookingId: z.string().min(1, { message: "Booking ID is required" }),
});

export const processPaymentSchema = z.object({
  paymentMethod: z.enum(["credit_card", "cash", "bank_transfer"], {
    message: "Invalid payment method",
  }),
});