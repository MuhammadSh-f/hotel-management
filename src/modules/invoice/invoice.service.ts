import { Invoice } from "./invoice.model";
import { Booking } from "../bookings/booking.model";
import { AppError } from "../../utils/AppError";

/**
 * Generate an invoice for a booking
 */
export const generateInvoice = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.status !== "confirmed")
    throw new AppError(
      "Only confirmed bookings can have invoices generated",
      400,
    );

  // Check if invoice already exists for this booking
  const existingInvoice = await Invoice.findOne({ booking: bookingId });
  if (existingInvoice) return existingInvoice;

  // Create new invoice
  const invoice = await Invoice.create({
    booking: bookingId,
    amount: booking.totalAmount,
    paymentStatus: "pending",
    paymentMethod: "credit_card",
  });

  return invoice;
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (invoiceId: string) => {
  const invoice = await Invoice.findById(invoiceId)
    .populate("booking", "checkIn checkOut totalAmount status")
    .populate({
      path: "booking",
      populate: {
        path: "room",
        select: "roomNum roomType price",
      },
    });

  if (!invoice) throw new AppError("Invoice not found", 404);

  return invoice;
};

/**
 * Process payment for an invoice
 */
export const processPayment = async (
  invoiceId: string,
  paymentMethod: "credit_card" | "cash" | "bank_transfer",
) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) throw new AppError("Invoice not found", 404);

  if (invoice.paymentStatus === "paid")
    throw new AppError("Invoice is already paid", 400);

  invoice.paymentMethod = paymentMethod;
  invoice.paymentStatus = "paid";
  invoice.issuedAt = new Date();
  await invoice.save();

  return invoice;
};

/**
 * Get all invoices (admin only)
 */
export const getAllInvoices = async () => {
  return Invoice.find()
    .populate("booking", "checkIn checkOut totalAmount")
    .sort({ createdAt: -1 });
};
