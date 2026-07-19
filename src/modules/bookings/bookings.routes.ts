import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
} from "./bookings.controller";
import { verifyToken, restrictTo } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { createBookingSchema } from "./bookings.validation";

const router = Router();

// All booking routes require authentication
router.use(verifyToken);

router.post("/", validateRequest(createBookingSchema), createBooking);
router.get("/", getUserBookings);
router.get("/admin/all", restrictTo("admin"), getAllBookings);
router.get("/:id", getBooking);
router.delete("/:id", cancelBooking);

export default router;