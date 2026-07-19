import express, { Application } from "express";
import authRouter from "./modules/auth/auth.routes";
import bookingRouter from "./modules/bookings/bookings.routes";
// import invoiceRouter from "./modules/billing/invoice.routes";
import roomRouter from "./modules/rooms/room.routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
// app.use("/api/invoice", invoiceRouter);

app.use(errorHandler);

export default app;
