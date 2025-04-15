import mongoose from "mongoose";

const eventRatingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you already have a User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

// To prevent the same user from rating the same event multiple times
eventRatingSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventRatingModel = mongoose.model("EventRating", eventRatingSchema);
