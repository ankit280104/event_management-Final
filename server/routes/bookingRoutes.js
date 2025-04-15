// routes/bookingRoutes.js
import express from "express";
import { validateBooking } from "../middleware/validation.js";
import { bookingController } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

// Create booking
bookingRoutes.post("/:userId", bookingController.createBooking);
bookingRoutes.get("/admin", bookingController.getAllAdminBookings);
// Get all bookings with filters
bookingRoutes.get("/:userId", bookingController.getAllBookings);

// Get single booking
bookingRoutes.get("/:bookingId", bookingController.getBooking);

// Update booking
bookingRoutes.patch(
  "/:bookingId",

  bookingController.updateBooking
);

export default bookingRoutes;
