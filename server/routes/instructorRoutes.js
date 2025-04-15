// routes/instructorRoutes.js
import express from "express";
import {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructorController.js";

const instructorRoutes = express.Router();

instructorRoutes.post("/", createInstructor);
instructorRoutes.get("/", getAllInstructors);
instructorRoutes.get("/:id", getInstructorById);
instructorRoutes.put("/:id", updateInstructor);
instructorRoutes.delete("/:id", deleteInstructor);

export default instructorRoutes;
