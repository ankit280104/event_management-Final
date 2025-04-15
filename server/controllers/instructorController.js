// controllers/instructorController.js
import { InstructorModel } from "../models//instructorModel.js";

export const createInstructor = async (req, res) => {
  const {
    name,
    email,
    phone,
    specialization,
    bio,
    image,
    socialLinks,
    isActive,
    events,
  } = req.body;
  if (!name || !email || !phone || !specialization || !bio) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const instructor = new InstructorModel({
      name,
      email,
      phone,
      specialization,
      bio,
      image,
      socialLinks,
      isActive,
      events,
    });
    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInstructors = async (req, res) => {
  try {
    const filters = req.query;
    const instructors = await InstructorModel.find(filters).populate("events");
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const instructor = await InstructorModel.findById(req.params.id).populate(
      "events"
    );
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const instructor = await InstructorModel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await InstructorModel.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
