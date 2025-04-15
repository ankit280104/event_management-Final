import { Booking } from "../models/bookingModel.js";
import { sendEmail } from "../config/mailer.js";

const templatePath = "event.notification.ejs";

export const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const { eventId, timeSlot } = req.body;
      const userId = req.params.userId;

      if (!eventId || !timeSlot) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const booking = new Booking({
        user: userId,
        event: eventId,
        timeSlot,
      });

      await booking.save();

      // Populate event and user details
      const populatedBooking = await Booking.findById(booking._id)
        .populate("event", "title dateTime")
        .populate("user", "name email");

      const emailData = {
        userName: populatedBooking.user.name,
        eventName: populatedBooking.event.title,
        specialRequirements: populatedBooking.specialRequirements || "None",
        userEmail: populatedBooking.user.email,
        confirmationLink: `https://yourwebsite.com/bookings/${booking._id}`,
      };

      console.log("Email", emailData.userEmail);

      await sendEmail(
        emailData.userEmail,
        "Booking Confirmation",
        emailData,
        "event.notification.ejs"
      );

      res.status(201).json({
        success: true,
        message: "You have successfully placed a booking",
        data: populatedBooking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating booking",
        error: error.message,
      });
    }
  },

  // Update booking
  updateBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      // Validate booking exists and belongs to user
      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or unauthorized",
        });
      }

      // Prevent updating certain fields
      const protectedFields = [
        "user",
        "event",
        "paymentStatus",
        "paymentDetails",
      ];
      protectedFields.forEach((field) => delete updateData[field]);

      // Update booking
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      ).populate({
        path: "event",
        select: "-__v",
        options: { lean: true },
      });

      res.json({
        success: true,
        data: updatedBooking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating booking",
        error: error.message,
      });
    }
  },

  // Get all bookings with populated event info
  getAllBookings: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Build filter object
      const filters = { user: userId };

      // Add status filter if provided
      if (req.query.status) {
        filters.status = req.query.status.toUpperCase();
      }

      // Add date range filter if provided
      if (req.query.startDate && req.query.endDate) {
        filters["timeSlot.startTime"] = {
          $gte: req.query.startDate,
          $lte: req.query.endDate,
        };
      }

      // Get bookings with populated fields
      const bookings = await Booking.find(filters)
        .populate({
          path: "event",
          select: "-__v",
          populate: [
            {
              path: "club",
              select: "-__v",
              options: { lean: true },
            },
            {
              path: "instructor",
              select: "-__v",
              options: { lean: true },
            },
          ],
          options: { lean: true },
        })
        .sort({ "timeSlot.startTime": -1 });

      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching bookings",
        error: error.message,
      });
    }
  },

  getAllAdminBookings: async (req, res) => {
    try {
      // Initialize filters object
      const filters = {};

      // Add status filter if provided
      if (req.query.status) {
        filters.status = req.query.status.toUpperCase();
      }

      // Add date range filter if provided
      if (req.query.startDate && req.query.endDate) {
        filters["timeSlot.startTime"] = {
          $gte: req.query.startDate,
          $lte: req.query.endDate,
        };
      }

      // Get bookings with populated fields
      const bookings = await Booking.find(filters)
        .populate({
          path: "event",
          select: "-__v",
          populate: [
            {
              path: "club",
              select: "-__v",
              options: { lean: true },
            },
            {
              path: "instructor",
              select: "-__v",
              options: { lean: true },
            },
          ],
          options: { lean: true },
        })
        .sort({ "timeSlot.startTime": -1 });

      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching bookings",
        error: error.message,
      });
    }
  },
  // Get single booking
  getBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const userId = req.user._id;

      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
      }).populate({
        path: "event",
        select: "-__v",
        populate: [
          {
            path: "club",
            select: "-__v",
            options: { lean: true },
          },
          {
            path: "instructor",
            select: "-__v",
            options: { lean: true },
          },
        ],
        options: { lean: true },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or unauthorized",
        });
      }

      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching booking",
        error: error.message,
      });
    }
  },
};
