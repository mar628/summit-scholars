const mongoose = require("mongoose");
const { user } = require("../../Constants/model.constants");

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
  },
  { timestamps: true }
);

const teacherModel = mongoose.model("teachers", TeacherSchema);

module.exports = teacherModel;
