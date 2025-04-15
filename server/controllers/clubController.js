import mongoose from "mongoose";
import { ClubModel } from "../models/clubModel.js";

// Create an club with error handling and required fields validation
export const createClub = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const club = new ClubModel({ ...req.body });
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMultipleClubs = async (req, res) => {
  try {
    const { clubs } = req.body;
    if (!Array.isArray(clubs) || clubs.length === 0) {
      return res.status(400).json({ error: "Invalid or empty clubs array" });
    }

    const createdClubs = [];
    for (const clubData of clubs) {
      const { title, image, description } = clubData;
      if (!title || !description || !image) {
        return res.status(400).json({ error: "Each club must have title, description, and image" });
      }
      const club = new ClubModel(clubData);
      await club.save();
      createdClubs.push(club);
    }

    res.status(201).json(createdClubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an club with improved error handling
export const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid club ID" });
    }
    const club = await ClubModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!club) return res.status(404).json({ error: "club not found" });
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all clubs with filters and error handling
export const getAllClubs = async (req, res) => {
  try {
    const filters = req.query;
    const clubs = await ClubModel.find(filters);
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single club by ID with validation
export const getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Club ID" });
    }
    const club = await ClubModel.findById(id);
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all clubs for a specific instructor with validation
export const getInstructorClubs = async (req, res) => {
  try {
    const { instructorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ error: "Invalid instructor ID" });
    }
    const clubs = await ClubModel.find({ instructor: instructorId });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove an instructor from an club with error handling
export const removeInstructorFromClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ error: "Invalid club ID" });
    }
    const club = await ClubModel.findById(clubId);
    if (!club) return res.status(404).json({ error: "club not found" });

    club.instructor = null;
    await club.save();
    res.status(200).json({ message: "Instructor removed from club" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete an club with validation
export const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid club ID" });
    }
    const club = await ClubModel.findByIdAndDelete(id);
    if (!club) return res.status(404).json({ error: "club not found" });
    res.status(200).json({ message: "club deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
