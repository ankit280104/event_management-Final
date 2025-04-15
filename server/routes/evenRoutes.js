import express from "express";
import {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  getInstructorEvents,
  removeInstructorFromEvent,
  deleteEvent,
  createMultipleEvents,
} from "../controllers/eventController.js";

const EventRouter = express.Router();

// Create an event
EventRouter.post("/:clubId", createEvent);
EventRouter.post("/many", createMultipleEvents);
// Update an event
EventRouter.put("/:id", updateEvent);

// Get all events with instructor details
EventRouter.get("/", getAllEvents);

// Get a single event by ID including instructor info
EventRouter.get("/:id", getEventById);

// Get all events for a specific instructor
EventRouter.get("/instructor/:instructorId", getInstructorEvents);

// Remove an instructor from an event
EventRouter.put("/remove-instructor/:eventId", removeInstructorFromEvent);

// Admin: Delete an event
EventRouter.delete("/:id", deleteEvent);

export default EventRouter;
