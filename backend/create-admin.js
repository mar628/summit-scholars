require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/Schema/users/user.model");
const { ADMIN } = require("./src/Constants/roles.constants");

async function run() {
  try {
    const mongoUrl =
      process.env.DEVELOPMENT_MODE === "production"
        ? process.env.DB_URL
        : process.env.DB_URL_DEV;

    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    const existing = await userModel.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const adminId = new mongoose.Types.ObjectId();

    const now = new Date();
    const start = new Date(now);
    start.setHours(8, 0, 0, 0);

    const end = new Date(now);
    end.setHours(17, 0, 0, 0);

    const admin = new userModel({
      _id: adminId,
      name: "System Admin",
      email: "admin@example.com",
      password: "Admin123!",
      gender: "male",
      fatherName: "N/A",
      motherName: "N/A",
      phone: "0700000000",
      address: "Nairobi",
      dateOfBirth: new Date("1990-01-01"),
      class: 12,
      school: "System Administration",
      boardType: new mongoose.Types.ObjectId("69c6f27e2108975bd4d805db"),
      role: ADMIN,
      timings: {
        start,
        startTimeHHMM: "08:00",
        end,
        endTimeHHMM: "17:00",
      },
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      isVerified: true,
      isActive: true,
      createdBy: adminId,
      updatedBy: adminId,
    });

    await admin.save();

    console.log("=================================");
    console.log("Admin created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: Admin123!");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

run();
