// routes/userRoutes.js
import express from "express";
import {
  register,
  login,
  updateUser,
  verifyUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  changeUserRole,
  getUserAnalytics,
  deleteAllUsers,
} from "../controllers/profileControllers.js";

// Import middleware for authentication and authorization
// import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const profileRoute = express.Router();

// Auth routes
profileRoute.post("/register", register);
profileRoute.post("/login", login);
profileRoute.delete("/delete-all", deleteAllUsers);
// User routes
profileRoute.get("/profile/:id", /* verifyToken, */ getUserProfile);
profileRoute.put("/:id", /* verifyToken, */ updateUser);
profileRoute.patch("/verify/:id", verifyUser);

// Admin routes - in a real app, you'd protect these with admin authorization middleware
profileRoute.get("/", /* verifyAdmin, */ getAllUsers);
profileRoute.delete("/:id", /* verifyAdmin, */ deleteUser);
profileRoute.patch("/role/:id", /* verifyAdmin, */ changeUserRole);
profileRoute.get("/analytics", /* verifyAdmin, */ getUserAnalytics);

export default profileRoute;
