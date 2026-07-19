import { z } from "zod";

export const createBookingSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID is required" }),
  checkIn: z.coerce.date({
    message: "Invalid check-in date format (use ISO 8601, e.g. 2026-07-15)",
  }),
  checkOut: z.coerce.date({
    message: "Invalid check-out date format (use ISO 8601, e.g. 2026-08-15)",
  }),
});
