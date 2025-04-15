import express from "express";
import {
  createClub,
  updateClub,
  getAllClubs,
  getClubById,
  getInstructorClubs,
  removeInstructorFromClub,
  deleteClub,
  createMultipleClubs,
} from "../controllers/clubController.js";

const ClubRouter = express.Router();

// Create an Club
ClubRouter.post("/", createClub);
ClubRouter.post("/multiple", createMultipleClubs);
// Update an Club
ClubRouter.put("/:id", updateClub);

// Get all Clubs with instructor details
ClubRouter.get("/", getAllClubs);

// Get a single Club by ID including instructor info
ClubRouter.get("/:id", getClubById);

// Get all Clubs for a specific instructor
ClubRouter.get("/instructor/:instructorId", getInstructorClubs);

// Remove an instructor from an Club
ClubRouter.put("/remove-instructor/:ClubId", removeInstructorFromClub);

// Admin: Delete an Club
ClubRouter.delete("/:id", deleteClub);

export default ClubRouter;
