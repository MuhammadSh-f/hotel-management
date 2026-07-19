import { Booking } from "./booking.model";
import { Room } from "../rooms/room.model";
import { AppError } from "../../utils/AppError";

/**
 * Create a new booking for a room
 */
export const createBooking = async (
  userId: string,
  roomId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  // Validate check-in/check-out dates
  if (checkIn >= checkOut) {
    throw new AppError("Check-out date must be after check-in date", 400);
  }

  if (checkIn < new Date()) {
    throw new AppError("Check-in date cannot be in the past", 400);
  }

  // Find the room and check availability
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (!room.isAvailable) {
    throw new AppError("Room is not available for booking", 409);
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    room: roomId,
    status: { $in: ["confirmed", "draft"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  if (overlappingBooking) {
    throw new AppError("Room is already booked for the selected dates", 409);
  }

  // Calculate total amount based on room price and nights
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalAmount = room.price * nights;

  // Create the booking
  const booking = await Booking.create({
    user: userId,
    room: roomId,
    checkIn,
    checkOut,
    status: "confirmed",
    totalAmount,
  });

  // Mark room as unavailable
  room.isAvailable = false;
  room.customers.push(userId);
  await room.save();

  return booking;
};

/**
 * Get all bookings for a specific user
 */
export const getBookingsByUser = async (userId: string) => {
  // Guard: a falsy userId would make Mongoose drop the filter and return every booking
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  return Booking.find({ user: userId })
    .populate("room", "roomNum roomType price")
    .sort({ createdAt: -1 });
};

/**
 * Get a specific booking by ID
 */
export const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate("room", "roomNum roomType price")
    .populate("user", "name email");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Check if user owns this booking
  if (booking.user.toString() !== userId) {
    throw new AppError("You do not have permission to cancel this booking", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  booking.status = "cancelled";
  await booking.save();

  // Make room available again
  const room = await Room.findById(booking.room);
  if (room) {
    room.isAvailable = true;
    room.customers = room.customers.filter(
      (customerId) => customerId.toString() !== userId,
    );
    await room.save();
  }

  return booking;
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async (userId?: string) => {
  const filter = userId ? { user: userId } : {};
  return Booking.find(filter)
    .populate("room", "roomNum roomType price")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};