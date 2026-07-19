import { Request, Response, NextFunction } from "express";
import * as invoiceService from "./invoice.service";
import { AppError } from "../../utils/AppError";

/**
 * Generate invoice for a booking
 */
export const generateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { bookingId } = req.body;

    if (!bookingId) {
      throw new AppError("Booking ID is required", 400);
    }

    const invoice = await invoiceService.generateInvoice(bookingId);

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by ID
 */
export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = req.params.id as string;
    const invoice = await invoiceService.getInvoiceById(id);

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process payment for an invoice
 */
export const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const id = req.params.id as string;
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      throw new AppError("Payment method is required", 400);
    }

    const validMethods = ["credit_card", "cash", "bank_transfer"];
    if (!validMethods.includes(paymentMethod)) {
      throw new AppError(
        `Invalid payment method. Must be one of: ${validMethods.join(", ")}`,
        400,
      );
    }

    const invoice = await invoiceService.processPayment(id, paymentMethod);

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all invoices (admin only)
 */
export const getAllInvoices = async (
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

    const invoices = await invoiceService.getAllInvoices();

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};
