const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { STUDENT, ADMIN, TEACHER } = require("../../Constants/roles.constants");
const { user, boards } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false, minimum: 8 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: STUDENT, enum: [ADMIN, STUDENT, TEACHER] },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    dateOfJoining: { type: Date, default: Date.now },

    // Student-only fields
    fatherName: { type: String },
    motherName: { type: String },
    dateOfBirth: { type: Date },
    class: { type: Number, min: 1, max: 12 },
    school: { type: String },
    boardType: { type: mongoose.Schema.Types.ObjectId, ref: boards },
    timings: {
      start: { type: Date },
      startTimeHHMM: { type: String },
      end: { type: Date },
      endTimeHHMM: { type: String },
    },
    days: {
      monday: { type: Boolean, default: false },
      tuesday: { type: Boolean, default: false },
      wednesday: { type: Boolean, default: false },
      thursday: { type: Boolean, default: false },
      friday: { type: Boolean, default: false },
      saturday: { type: Boolean, default: false },
      sunday: { type: Boolean, default: false },
    },

    // Teacher-only fields
    subject: { type: String },
    qualification: { type: String },
    experience: { type: Number, min: 0 },

    google: {
      isConnected: { type: Boolean, default: false },
      profileDetails: { type: Object },
      tokens: { type: Object },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: user },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: user, required: true },
  },
  { timestamps: true }
);

ModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel = mongoose.model(user, ModelSchema);
module.exports = userModel;
