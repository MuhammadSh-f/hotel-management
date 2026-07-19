import { Request, Response, NextFunction } from "express";
import * as bookingService from "./bookings.service";
import { AppError } from "../../utils/AppError";

/**
 * Create a new booking
 */
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      throw new AppError(
        "Room ID, check-in and check-out dates are required",
        400,
      );
    }

    const booking = await bookingService.createBooking(
      req.user.id,
      roomId,
      new Date(checkIn),
      new Date(checkOut),
    );

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const bookings = await bookingService.getBookingsByUser(req.user.id);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific booking
 */
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = req.params.id as string;
    const booking = await bookingService.getBookingById(id);

    // `booking.user` is populated (an object), so compare its _id — calling
    // toString() on the object would yield "[object Object]" and wrongly deny access
    if (
      String((booking.user as unknown as { _id: unknown })._id) !==
        req.user.id &&
      req.user.role !== "admin"
    ) {
      throw new AppError(
        "You do not have permission to view this booking",
        403,
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = req.params.id as string;
    const booking = await bookingService.cancelBooking(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (req.user.role !== "admin") {
      throw new AppError("Admin access required", 403);
    }

    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;
    const bookings = await bookingService.getAllBookings(userId);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
