const mongoose = require("mongoose");
const { user, batches, subjects } = require("../../Constants/model.constants");

const TeachingProgressSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: user, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    classLevel: { type: Number, min: 1, max: 12 },
    date: { type: Date, default: Date.now },
    duration: { type: Number, default: 60, min: 1 }, // minutes
    status: { type: String, enum: ["planned", "completed", "cancelled"], default: "completed" },
    studentCount: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const teachingProgressModel = mongoose.model("teaching_progress", TeachingProgressSchema);
module.exports = teachingProgressModel;
