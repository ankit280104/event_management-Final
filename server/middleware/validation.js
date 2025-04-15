export const validateBooking = (req, res, next) => {
  try {
    const { eventId, timeSlot, paymentDetails } = req.body;

    // Basic validation
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    if (timeSlot) {
      const { startTime, endTime } = timeSlot;
      if (!startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Both start time and end time are required",
        });
      }

      // Validate time format and logic
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid time format",
        });
      }

      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }
    }

    if (paymentDetails) {
      const { amount } = paymentDetails;
      if (amount !== undefined && (isNaN(amount) || amount < 0)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment amount",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking data",
      error: error.message,
    });
  }
};
