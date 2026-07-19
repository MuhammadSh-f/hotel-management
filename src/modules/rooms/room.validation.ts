import { z } from "zod";

export const createRoomSchema = z.object({
  roomNum: z.coerce
    .number({ message: "Room number must be a number" })
    .int("Room number must be an integer")
    .positive("Room number must be a positive number"),
  roomType: z.string().min(1, { message: "Room type is required" }),
  price: z.coerce
    .number({ message: "Price must be a number" })
    .positive("Price must be a positive number"),
});
