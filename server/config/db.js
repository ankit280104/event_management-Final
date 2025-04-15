import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbURI =
      "mongodb+srv://kunduankit054:QybqanTM5cjXUUMs@event.afevq.mongodb.net/?retryWrites=true&w=majority&appName=event";

    console.log("MongoDB URI:", dbURI); // Debugging line

    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
