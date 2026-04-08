require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/Schema/users/user.model");

async function run() {
  try {
    const mongoUrl =
      process.env.DEVELOPMENT_MODE === "production"
        ? process.env.DB_URL
        : process.env.DB_URL_DEV;

    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    const admin = await userModel.findOne({ email: "admin@example.com" }).select("+password");

    if (!admin) {
      console.log("Admin user not found");
      process.exit(0);
    }

    admin.password = "Admin123!";
    admin.isVerified = true;
    admin.isActive = true;

    await admin.save();

    console.log("Password reset successful");
    console.log("Email: admin@example.com");
    console.log("Password: Admin123!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to reset admin password:", error);
    process.exit(1);
  }
}

run();