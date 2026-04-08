const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const batchModel = require("../../Schema/batches/batch.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");

const createNewBatchController = async (req, res, next) => {
  try {
    logger.info("Controllers - batch - batch.controller - createNewBatchController - Start");
    let { name, startDate, endDate } = req.body;
    const existingBatch = await batchModel.findOne({ name: name.toLowerCase() });
    if (existingBatch) {
      return next(httpErrors.BadRequest("batch with the same name already exists."));
    }
    const data = new batchModel({
      name,
      startDate,
      endDate,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    await data.save();
    logger.info("Controllers - batch - batch.controller - createNewBatchController - End");
    res.status(201).send({ success: true, statusCode: 201, message: "Batch successfully created.", data });
  } catch (error) {
    logger.error("Controllers - batch - batch.controller - createNewBatchController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getBatchesListController = async (req, res, next) => {
  try {
    logger.info("Controllers - batch - batch.controller - getBatchesListController - Start");
    const { sort } = req.query;
    let sortQuery = sortConstants["-createdAt"];
    if (sort) sortQuery = sortConstants[sort];
    const boardData = await batchModel.find().populate("createdBy updatedBy", "name").sort(sortQuery).lean();
    logger.info("Controllers - batch - batch.controller - getBatchesListController - End");
    res.status(200).send({ success: true, statusCode: 200, message: "Batch list retrieved successfully.", data: boardData });
  } catch (error) {
    logger.error("Controllers - batch - batch.controller - getBatchesListController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateBatchController = async (req, res, next) => {
  try {
    logger.info("Controllers - batch - batch.controller - updateBatchController - Start");
    const { batchId } = req.params;
    const { name, startDate, endDate } = req.body;

    const batch = await batchModel.findById(batchId);
    if (!batch) return next(httpErrors.NotFound("Batch not found."));

    // Check name uniqueness if name is being changed
    if (name && name.toLowerCase() !== batch.name) {
      const existing = await batchModel.findOne({ name: name.toLowerCase(), _id: { $ne: batchId } });
      if (existing) return next(httpErrors.BadRequest("A batch with this name already exists."));
    }

    const updated = await batchModel.findByIdAndUpdate(
      batchId,
      { name, startDate, endDate, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "name").lean();

    logger.info("Controllers - batch - batch.controller - updateBatchController - End");
    res.status(200).send({ success: true, statusCode: 200, message: "Batch updated successfully.", data: updated });
  } catch (error) {
    logger.error("Controllers - batch - batch.controller - updateBatchController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const toggleBatchStatusController = async (req, res, next) => {
  try {
    logger.info("Controllers - batch - batch.controller - toggleBatchStatusController - Start");
    const { batchId } = req.params;

    const batch = await batchModel.findById(batchId);
    if (!batch) return next(httpErrors.NotFound("Batch not found."));

    // If activating this batch, deactivate all others first (only one active batch at a time)
    if (!batch.isActive) {
      await batchModel.updateMany({ _id: { $ne: batchId } }, { $set: { isActive: false } });
    }

    const updated = await batchModel.findByIdAndUpdate(
      batchId,
      { isActive: !batch.isActive, updatedBy: req.user._id },
      { new: true }
    ).populate("createdBy updatedBy", "name").lean();

    logger.info("Controllers - batch - batch.controller - toggleBatchStatusController - End");
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: `Batch ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: updated,
    });
  } catch (error) {
    logger.error("Controllers - batch - batch.controller - toggleBatchStatusController - Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteBatchController = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await batchModel.findById(batchId);
    if (!batch) return next(httpErrors.NotFound("Batch not found."));
    await batchModel.findByIdAndDelete(batchId);
    res.status(200).send({ success: true, statusCode: 200, message: "Batch deleted successfully." });
  } catch (error) {
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewBatchController,
  getBatchesListController,
  updateBatchController,
  toggleBatchStatusController,
  deleteBatchController,
};
