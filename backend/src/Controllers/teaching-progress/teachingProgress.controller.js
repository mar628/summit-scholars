const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const teachingProgressModel = require("../../Schema/teaching-progress/teachingProgress.model");
const errorHandling = require("../../Utils/errorHandling");

const createProgressController = async (req, res, next) => {
  try {
    const { title, description, subject, topic, classLevel, date, duration, status, studentCount, notes } = req.body;
    const entry = new teachingProgressModel({
      teacherId: req.user._id,
      title, description, subject, topic, classLevel,
      date: date || Date.now(),
      duration: duration || 60,
      status: status || "completed",
      studentCount: studentCount || 0,
      notes: notes || "",
    });
    await entry.save();
    res.status(201).send({ success: true, statusCode: 201, message: "Progress logged.", data: entry });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getMyProgressController = async (req, res, next) => {
  try {
    const data = await teachingProgressModel
      .find({ teacherId: req.user._id })
      .sort({ date: -1 })
      .lean();
    res.status(200).send({ success: true, statusCode: 200, data });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateProgressController = async (req, res, next) => {
  try {
    const { progressId } = req.params;
    const entry = await teachingProgressModel.findOne({ _id: progressId, teacherId: req.user._id });
    if (!entry) return next(httpErrors.NotFound("Progress entry not found."));
    const updated = await teachingProgressModel.findByIdAndUpdate(progressId, req.body, { new: true }).lean();
    res.status(200).send({ success: true, statusCode: 200, data: updated });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteProgressController = async (req, res, next) => {
  try {
    const { progressId } = req.params;
    const entry = await teachingProgressModel.findOne({ _id: progressId, teacherId: req.user._id });
    if (!entry) return next(httpErrors.NotFound("Progress entry not found."));
    await teachingProgressModel.findByIdAndDelete(progressId);
    res.status(200).send({ success: true, statusCode: 200, message: "Deleted." });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Admin: get progress for a specific teacher
const getTeacherProgressController = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const data = await teachingProgressModel.find({ teacherId }).sort({ date: -1 }).lean();
    res.status(200).send({ success: true, statusCode: 200, data });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createProgressController,
  getMyProgressController,
  updateProgressController,
  deleteProgressController,
  getTeacherProgressController,
};
