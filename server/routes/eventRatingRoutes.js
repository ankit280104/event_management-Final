import express from "express";
import { createEventRating, getAverageRating, getEventRatings } from "server/controllers/eventRatingController";


const ratingRouter = express.Router();

// POST /api/ratings - rate an event
ratingRouter.post("/", createEventRating);

// GET /api/ratings/:eventId - get ratings for an event
ratingRouter.get("/:eventId", getEventRatings);

// GET /api/ratings/:eventId/average - get average rating
ratingRouter.get("/:eventId/average", getAverageRating);

export default ratingRouter;
