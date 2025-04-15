// controllers/userController.js
import { createError } from "../utils/error.js";
import { User } from "../models/userModel.js";

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { clerkId, name, email, password, address, photoUrl, phone, gender } =
      req.body;

    // Check if user already exists with the email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User with this email already exists"));
    }

    // Create new user
    const newUser = new User({
      clerkId,
      name,
      email,
      password,
      address,
      photoUrl,
      phone,
      gender,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = savedUser._doc;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register before logging in.",
      });
    }

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, phone, photoUrl, gender } = req.body;

    // Optional: Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Filter out undefined fields to ensure only provided ones are updated
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (address !== undefined) updateFields.address = address;
    if (phone !== undefined) updateFields.phone = phone;
    if (photoUrl !== undefined) updateFields.photoUrl = photoUrl;
    if (gender !== undefined) updateFields.gender = gender;

    // Update user only with provided fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select("-password"); // Exclude password from the result

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Verify user account
export const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update user verification status
    const verifiedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { isVerified: true },
      },
      { new: true }
    ).select("-password");

    if (!verifiedUser) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: verifiedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN CONTROLLERS

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    // Optional: Implement pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalUsers = await User.countDocuments();

    // Query with pagination
    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Change user role (admin only)
export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the user making the request
    const { role, email } = req.body;

    // Validate role
    if (!["ADMIN", "USER", "OTHER"].includes(role)) {
      return next(createError(400, "Invalid role"));
    }

    // Check if the requester is an admin
    const requestingUser = await User.findById(id);
    if (!requestingUser || requestingUser.role !== "ADMIN") {
      return next(
        createError(403, "Unauthorized: Only admins can change roles")
      );
    }

    // Find the user by email and update their role
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { role } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: `User role changed to ${role} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Get user analytics data (admin only)
export const getUserAnalytics = async (req, res, next) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count verified users
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Count users by role
    const adminUsers = await User.countDocuments({ role: "ADMIN" });
    const regularUsers = await User.countDocuments({ role: "USER" });
    const otherUsers = await User.countDocuments({ role: "OTHER" });

    // Count users by gender
    const maleUsers = await User.countDocuments({ gender: "male" });
    const femaleUsers = await User.countDocuments({ gender: "female" });
    const otherGenderUsers = await User.countDocuments({ gender: "other" });

    // Get new users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Monthly registration data for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Transform to more readable format
    const registrationByMonth = monthlyData.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        month: date.toLocaleString("default", { month: "long" }),
        year: item._id.year,
        count: item.count,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        roleDistribution: {
          admin: adminUsers,
          user: regularUsers,
          other: otherUsers,
        },
        genderDistribution: {
          male: maleUsers,
          female: femaleUsers,
          other: otherGenderUsers,
          unspecified:
            totalUsers - (maleUsers + femaleUsers + otherGenderUsers),
        },
        newUsersLast30Days: newUsers,
        registrationByMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllUsers = async (req, res, next) => {
  try {
    // Delete all users from the database
    const result = await User.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All users have been deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
