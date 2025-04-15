import "dotenv/config";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import EventRouter from "./routes/evenRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";

import { connectDB } from "./config/db.js";
import ClubRouter from "./routes/clubRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
// import userRoute from "./routes/userRoutes.js";
import profileRoute from "./routes/profileRouts.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

console.log("Clerk Secret Key loaded:", !!process.env.CLERK_SECRET_KEY);
console.log("Server running on port:", !!process.env.CLERK_PUBLISHABLE_KEY);

const corsOptions = {
  origin: ["http://localhost:5173","http://localhost:5174", "https://eventmanagement-weld.vercel.app"], // Allow local and deployed frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/events", EventRouter);
app.use("/api/instructor", instructorRoutes);
app.use("/api/clubs", ClubRouter);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);

// Test endpoint to verify CORS
app.get("/api", (req, res) => {
  res.json({ message: "CORS is working" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${corsOptions.origin}`);
});
