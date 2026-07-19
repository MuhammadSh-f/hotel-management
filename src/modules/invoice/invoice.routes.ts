import { Router } from "express";
import {
  generateInvoice,
  getInvoice,
  processPayment,
  getAllInvoices,
} from "./invoice.controller";
import { verifyToken, restrictTo } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate";
import {
  generateInvoiceSchema,
  processPaymentSchema,
} from "./invoice.validation";

const router = Router();

// All invoice routes require authentication
router.use(verifyToken);

router.post("/", validateRequest(generateInvoiceSchema), generateInvoice);
router.get("/all", restrictTo("admin"), getAllInvoices);
router.get("/:id", getInvoice);
router.post(
  "/:id/payment",
  validateRequest(processPaymentSchema),
  processPayment,
);

export default router;
