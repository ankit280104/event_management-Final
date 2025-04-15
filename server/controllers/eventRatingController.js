import { EventRatingModel } from "server/models/eventRatingModel";


export const createEventRating = async (req, res) => {
  try {
    const { event,rating, review } = req.body;
    const userId = req.params.userId;

    const existing = await EventRatingModel.findOne({ event, user:userId });
    if (existing) {
      return res.status(400).json({ message: "You already rated this event." });
    }

    const newRating = await EventRatingModel.create({ event, user:userId, rating, review });
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: "Error rating event", error: err.message });
  }
};

export const getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const ratings = await EventRatingModel.find({ event: eventId }).populate("user", "name");
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await EventRatingModel.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: "$event",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Error calculating average", error: err.message });
  }
};
