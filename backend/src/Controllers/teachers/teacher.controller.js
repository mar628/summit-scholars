const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const teacherModel = require("../../Schema/teachers/teacher.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");

const createTeacherController = async (req, res, next) => {
  try {
    logger.info("Controllers - teachers - teacher.controller - createTeacherController - Start");

    const { name, email, phone, subject, qualification, experience, gender, address, joiningDate } = req.body;

    const existingTeacher = await teacherModel.findOne({ email: email.toLowerCase() });
    if (existingTeacher) {
      return next(httpErrors.BadRequest("A teacher with this email already exists."));
    }

    const data = new teacherModel({
      name,
      email,
      phone,
      subject,
      qualification,
      experience,
      gender,
      address,
      joiningDate: joiningDate || Date.now(),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await data.save();

    logger.info("Controllers - teachers - teacher.controller - createTeacherController - End");
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "Teacher created successfully.",
      data,
    });
  } catch (error) {
    logger.error("Controllers - teachers - teacher.controller - createTeacherController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getTeachersListController = async (req, res, next) => {
  try {
    logger.info("Controllers - teachers - teacher.controller - getTeachersListController - Start");

    const { sort } = req.query;
    let sortQuery = sortConstants["-createdAt"];
    if (sort) sortQuery = sortConstants[sort];

    const data = await teacherModel
      .find()
      .populate("createdBy updatedBy", "name")
      .sort(sortQuery)
      .lean();

    logger.info("Controllers - teachers - teacher.controller - getTeachersListController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Teachers list retrieved successfully.",
      data,
    });
  } catch (error) {
    logger.error("Controllers - teachers - teacher.controller - getTeachersListController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSingleTeacherController = async (req, res, next) => {
  try {
    logger.info("Controllers - teachers - teacher.controller - getSingleTeacherController - Start");

    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId).populate("createdBy updatedBy", "name").lean();

    if (!teacher) {
      return next(httpErrors.NotFound("Teacher not found."));
    }

    logger.info("Controllers - teachers - teacher.controller - getSingleTeacherController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Teacher details retrieved successfully.",
      data: teacher,
    });
  } catch (error) {
    logger.error("Controllers - teachers - teacher.controller - getSingleTeacherController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateTeacherController = async (req, res, next) => {
  try {
    logger.info("Controllers - teachers - teacher.controller - updateTeacherController - Start");

    const { teacherId } = req.params;
    const { name, phone, subject, qualification, experience, gender, address, joiningDate, isActive } = req.body;

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return next(httpErrors.NotFound("Teacher not found."));
    }

    const updated = await teacherModel.findByIdAndUpdate(
      teacherId,
      {
        name,
        phone,
        subject,
        qualification,
        experience,
        gender,
        address,
        joiningDate,
        isActive,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "name").lean();

    logger.info("Controllers - teachers - teacher.controller - updateTeacherController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Teacher updated successfully.",
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - teachers - teacher.controller - updateTeacherController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteTeacherController = async (req, res, next) => {
  try {
    logger.info("Controllers - teachers - teacher.controller - deleteTeacherController - Start");

    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return next(httpErrors.NotFound("Teacher not found."));
    }

    await teacherModel.findByIdAndDelete(teacherId);

    logger.info("Controllers - teachers - teacher.controller - deleteTeacherController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Teacher deleted successfully.",
    });
  } catch (error) {
    logger.error("Controllers - teachers - teacher.controller - deleteTeacherController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createTeacherController,
  getTeachersListController,
  getSingleTeacherController,
  updateTeacherController,
  deleteTeacherController,
};
