const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const feeModel = require("../../Schema/fees/fee.model");
const errorHandling = require("../../Utils/errorHandling");

// Admin: create a fee record for a student
const createFeeController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - createFeeController - Start");
    const { studentId, title, amount, dueDate, description, month } = req.body;

    const fee = new feeModel({
      studentId,
      title,
      amount,
      dueDate,
      description: description || "",
      month: month || "",
      status: "pending",
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    await fee.save();
    await fee.populate("studentId", "name email");

    logger.info("Controllers - fees - createFeeController - End");
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "Fee record created successfully.",
      data: fee,
    });
  } catch (error) {
    logger.error("Controllers - fees - createFeeController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Admin: get all fees (optionally filtered by studentId)
const getFeesListController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - getFeesListController - Start");
    const { studentId, status } = req.query;

    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;

    const fees = await feeModel
      .find(filter)
      .populate("studentId", "name email")
      .populate("createdBy updatedBy", "name")
      .sort({ dueDate: -1 })
      .lean();

    // Auto-mark overdue
    const now = new Date();
    const updated = fees.map((f) => {
      if (f.status === "pending" && new Date(f.dueDate) < now) {
        return { ...f, status: "overdue" };
      }
      return f;
    });

    logger.info("Controllers - fees - getFeesListController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Fees list retrieved successfully.",
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - fees - getFeesListController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Admin: get fees for a specific student
const getStudentFeesController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - getStudentFeesController - Start");
    const { studentId } = req.params;

    const fees = await feeModel
      .find({ studentId })
      .populate("createdBy updatedBy", "name")
      .sort({ dueDate: -1 })
      .lean();

    const now = new Date();
    const updated = fees.map((f) => {
      if (f.status === "pending" && new Date(f.dueDate) < now) {
        return { ...f, status: "overdue" };
      }
      return f;
    });

    logger.info("Controllers - fees - getStudentFeesController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Student fees retrieved successfully.",
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - fees - getStudentFeesController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Admin: mark fee as paid / update status
const updateFeeController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - updateFeeController - Start");
    const { feeId } = req.params;
    const { status, paidDate, title, amount, dueDate, description, month } = req.body;

    const fee = await feeModel.findById(feeId);
    if (!fee) return next(httpErrors.NotFound("Fee record not found."));

    const updatePayload = {
      updatedBy: req.user._id,
    };
    if (title !== undefined) updatePayload.title = title;
    if (amount !== undefined) updatePayload.amount = amount;
    if (dueDate !== undefined) updatePayload.dueDate = dueDate;
    if (description !== undefined) updatePayload.description = description;
    if (month !== undefined) updatePayload.month = month;
    if (status !== undefined) {
      updatePayload.status = status;
      if (status === "paid") {
        updatePayload.paidDate = paidDate || new Date();
      }
    }

    const updated = await feeModel
      .findByIdAndUpdate(feeId, updatePayload, { new: true, runValidators: true })
      .populate("studentId", "name email")
      .populate("createdBy updatedBy", "name")
      .lean();

    logger.info("Controllers - fees - updateFeeController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Fee record updated successfully.",
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - fees - updateFeeController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Admin: delete a fee record
const deleteFeeController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - deleteFeeController - Start");
    const { feeId } = req.params;
    const fee = await feeModel.findById(feeId);
    if (!fee) return next(httpErrors.NotFound("Fee record not found."));

    await feeModel.findByIdAndDelete(feeId);

    logger.info("Controllers - fees - deleteFeeController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Fee record deleted successfully.",
    });
  } catch (error) {
    logger.error("Controllers - fees - deleteFeeController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

// Student: get my own fees
const getMyFeesController = async (req, res, next) => {
  try {
    logger.info("Controllers - fees - getMyFeesController - Start");
    const studentId = req.user._id;

    const fees = await feeModel
      .find({ studentId })
      .populate("createdBy", "name")
      .sort({ dueDate: -1 })
      .lean();

    const now = new Date();
    const updated = fees.map((f) => {
      if (f.status === "pending" && new Date(f.dueDate) < now) {
        return { ...f, status: "overdue" };
      }
      return f;
    });

    logger.info("Controllers - fees - getMyFeesController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "My fees retrieved successfully.",
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - fees - getMyFeesController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createFeeController,
  getFeesListController,
  getStudentFeesController,
  updateFeeController,
  deleteFeeController,
  getMyFeesController,
};
