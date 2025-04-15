import mongoose from "mongoose";
import { EventModel } from "../models/eventModel.js";

// Create an event with error handling and required fields validation
export const createEvent = async (req, res) => {
  const clubId = req.params.clubId;
  
  try {
    const {
      title,
      image,
      description,
      availableSeats,
      price,
      instructor,
      date,
    } = req.body;

    if (
      !title ||
      !description ||
      !availableSeats ||
      !price ||
      !date ||
      !image
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new event object with the clubId
    const event = new EventModel({
      ...req.body,
      club: clubId,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMultipleEvents = async (req, res) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "Invalid or empty events array" });
    }

    const createdEvents = [];
    for (const eventData of events) {
      const { title, image, description, availableSeats, price, date } =
        eventData;
      if (
        !title ||
        !description ||
        availableSeats === undefined ||
        price === undefined ||
        !date ||
        !image
      ) {
        return res.status(400).json({
          error:
            "Each event must have title, description, availableSeats, price, date, and image",
        });
      }
      const event = new EventModel({ ...eventData });
      await event.save();
      createdEvents.push(event);
    }

    res.status(201).json(createdEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event with improved error handling
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    const event = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events with filters and error handling// Get all events with club and instructor information
export const getAllEvents = async (req, res) => {
  try {
    const filters = req.query;

    // Use populate to fetch related club and instructor information
    const events = await EventModel.find(filters)
      .populate("club") // Populate the club details
      .populate("instructor"); // Populate the instructor details

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single event by ID with validation and populate club and instructor information
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Fetch the event and populate related club and instructor data
    // Now try population
    const events = await EventModel.find(filters)
      .populate({
        path: "club",
        select: "-__v", // Exclude version field
        options: { lean: true }, // For better performance
      })
      .populate({
        path: "instructor",
        select: "-__v",
        options: { lean: true },
      });

    // Debug populated results
    console.log(
      "Events after population:",
      events.map((event) => ({
        id: event._id,
        title: event.title,
        hasClub: !!event.club,
        hasInstructor: !!event.instructor,
        clubId: event.club?._id,
        instructorId: event.instructor?._id,
      }))
    );

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events for a specific instructor with validation
export const getInstructorEvents = async (req, res) => {
  try {
    const { instructorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ error: "Invalid instructor ID" });
    }
    const events = await EventModel.find({ instructor: instructorId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove an instructor from an event with error handling
export const removeInstructorFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.instructor = null;
    await event.save();
    res.status(200).json({ message: "Instructor removed from event" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete an event with validation
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    const event = await EventModel.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
