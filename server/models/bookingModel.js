// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    timeSlot: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED", "FAILED"],
      default: "PENDING",
    },
    paymentDetails: {
      amount: {
        type: Number
      },
      transactionId: String,
      paymentMethod: String,
      paymentDate: Date,
    },
    attendanceStatus: {
      type: String,
      enum: ["NOT_ATTENDED", "ATTENDED", "EXCUSED"],
      default: "NOT_ATTENDED",
    },
    cancellationReason: String,
    specialRequirements: String,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
    remindersSent: [
      {
        type: {
          type: String,
          enum: ["EMAIL", "SMS"],
        },
        sentAt: Date,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
    indexes: [
      { user: 1, event: 1 }, // Compound index for faster queries
      { status: 1 }, // Index for status queries
      { paymentStatus: 1 }, // Index for payment status queries
    ],
  }
);

// Prevent duplicate bookings
bookingSchema.index(
  { user: 1, event: 1, "timeSlot.startTime": 1 },
  { unique: true }
);

// Pre-save middleware to check event capacity
bookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Event = mongoose.model("Event");
    const event = await Event.findById(this.event);

    if (!event) {
      throw new Error("Event not found");
    }

    const currentBookings = await this.constructor.countDocuments({
      event: this.event,
      status: { $nin: ["CANCELLED"] },
    });

    if (currentBookings >= event.availableSeats) {
      throw new Error("Event is fully booked");
    }
  }
  next();
});

// Instance method to cancel booking
bookingSchema.methods.cancelBooking = async function (reason) {
  this.status = "CANCELLED";
  this.cancellationReason = reason;
  await this.save();
};

// Static method to get user's upcoming bookings
bookingSchema.statics.getUpcomingBookings = function (userId) {
  return this.find({
    user: userId,
    status: "CONFIRMED",
    "event.date": { $gte: new Date() },
  })
    .populate("event")
    .sort({ "event.date": 1 });
};

export const Booking = mongoose.model("Booking", bookingSchema);
