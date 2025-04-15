import mongoose from "mongoose";
import { EventModel } from "./models/eventModel.js";

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI =
  "mongodb+srv://achiandoomollo64:achiando%234838@mernshopping.yincy2t.mongodb.net/?retryWrites=true&w=majority&appName=Wanx";

// Clubs and their corresponding clubId mappings
const clubs = {
  "Cultural Club": "67c7ec362343c9959b442333",
  "Gaming Club": "67c800a5dd78729afa97e74c",
  "Programming Club": "67c800c1dd78729afa97e74e",
  "Art Club": "67c800cddd78729afa97e750",
  "Sport Club": "67c800d9dd78729afa97e752",
  "Drama Club": "67c800e4dd78729afa97e754",
};

// Extended mapping of events to clubs based on event titles and descriptions
const eventToClubMapping = {
  // Events that were already in your original mapping
  "Cultural Music Night": "Cultural Club",
  "E-Sports Championship": "Gaming Club",
  "Python Coding Bootcamp": "Programming Club",
  "Abstract Art Workshop": "Art Club",
  "Soccer Training Camp": "Sport Club",
  "Drama Performance": "Drama Club",

  // Additional events from the data with their suggested club mappings
  "Cultural Dance Workshop": "Cultural Club",
  "Retro Gaming Night": "Gaming Club",
  "AI & Machine Learning Workshop": "Programming Club",
  "Full-Stack Web Development": "Programming Club",
  "Web Development": "Programming Club",
  "Introduction to Web Development": "Programming Club",
  "Digital Art Masterclass": "Art Club",
  "Sculpture Workshop": "Art Club",
  "Basketball Tournament": "Sport Club",
  "Marathon Training": "Sport Club",
  "Yoga & Wellness Retreat": "Sport Club",
  "Table Tennis Championship": "Sport Club",
  "Flare Dance Night": "Cultural Club",
  "Rhythm & Moves Dance Workshop": "Cultural Club",
};

// Function to update events with clubId
const updateEventsWithClubId = async () => {
  try {
    // Establish connection to MongoDB first
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // Get all events
    const events = await EventModel.find({});
    console.log(`Found ${events.length} events in total`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Update each event
    for (const event of events) {
      try {
        // REMOVED the skip condition to force updates
        // Check if we have a direct mapping for this event title
        const clubTitle = eventToClubMapping[event.title];
        if (clubTitle) {
          const clubId = clubs[clubTitle];

          if (clubId) {
            // Update the event with the correct clubId
            await EventModel.updateOne(
              { _id: event._id },
              { $set: { club: clubId } }
            );

            console.log(
              `Updated "${event.title}" with club ID for ${clubTitle}`
            );
            updatedCount++;
          } else {
            console.log(
              `Club mapping found for "${event.title}", but no club ID exists for "${clubTitle}"`
            );
            errorCount++;
          }
        } else {
          // If no direct mapping, try to infer based on description keywords
          let assignedClub = null;

          const description =
            event.title.toLowerCase() + " " + event.description.toLowerCase();

          if (
            description.includes("code") ||
            description.includes("web") ||
            description.includes("programming") ||
            description.includes("javascript") ||
            description.includes("python") ||
            description.includes("development")
          ) {
            assignedClub = "Programming Club";
          } else if (
            description.includes("game") ||
            description.includes("gaming") ||
            description.includes("esport")
          ) {
            assignedClub = "Gaming Club";
          } else if (
            description.includes("paint") ||
            description.includes("art") ||
            description.includes("creative") ||
            description.includes("sculpture")
          ) {
            assignedClub = "Art Club";
          } else if (
            description.includes("soccer") ||
            description.includes("basketball") ||
            description.includes("sport") ||
            description.includes("fitness") ||
            description.includes("training") ||
            description.includes("yoga") ||
            description.includes("marathon") ||
            description.includes("tennis")
          ) {
            assignedClub = "Sport Club";
          } else if (
            description.includes("dance") ||
            description.includes("music") ||
            description.includes("cultural") ||
            description.includes("performance")
          ) {
            assignedClub = "Cultural Club";
          } else if (
            description.includes("drama") ||
            description.includes("acting") ||
            description.includes("theatre") ||
            description.includes("perform")
          ) {
            assignedClub = "Drama Club";
          }

          if (assignedClub) {
            const clubId = clubs[assignedClub];
            // Update the event with the inferred clubId
            await EventModel.updateOne(
              { _id: event._id },
              { $set: { club: clubId } }
            );

            console.log(
              `Inferred and updated "${event.title}" with club ID for ${assignedClub}`
            );
            updatedCount++;
          } else {
            console.log(
              `No mapping found for "${event.title}", and couldn't infer club type`
            );
            errorCount++;
          }
        }
      } catch (eventError) {
        console.error(
          `Error processing event "${event.title}":`,
          eventError.message
        );
        errorCount++;
      }
    }

    console.log("\nUpdate Summary:");
    console.log(`Total events: ${events.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Failed to update: ${errorCount}`);
  } catch (error) {
    console.error("Error updating events:", error.message);
  } finally {
    // Close the MongoDB connection when done
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Run the function to update events
updateEventsWithClubId();
