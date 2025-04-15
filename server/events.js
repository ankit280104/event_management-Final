import mongoose from "mongoose";
import { EventModel } from "./models/eventModel.js";

const MONGODB_URI = "mongodb+srv://achiandoomollo64:achiando%234838@mernshopping.yincy2t.mongodb.net/?retryWrites=true&w=majority&appName=Wanx";

// Function to generate at least 3 random time slots
const generateTimeSlots = () => {
  const startHours = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];
  const slots = [];
  
  for (let i = 0; i < 3; i++) { // Ensure at least 3 time slots per event
    const startTime = startHours[i];
    const endTime = startHours[i + 1] || "10:00 PM";
    slots.push({ startTime, endTime });
  }
  return slots;
};

// Function to update events with future time slots
const updateEventsWithTimeSlots = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    const events = await EventModel.find({});
    console.log(`Found ${events.length} events in total`);

    for (const event of events) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 7) + 1); // Random date within the next week

      await EventModel.updateOne(
        { _id: event._id },
        { $set: { date: futureDate, timeSlots: generateTimeSlots() } }
      );

      console.log(`Updated event "${event.title}" with new time slots on ${futureDate.toDateString()}`);
    }
  } catch (error) {
    console.error("Error updating events:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

updateEventsWithTimeSlots();
