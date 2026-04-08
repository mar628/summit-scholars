const express = require("express");
const { Authentication, Authorization } = require("../../Middlewares/Auth.middleware");
const {
  createNewBatchController,
  getBatchesListController,
  updateBatchController,
  toggleBatchStatusController,
  deleteBatchController,
} = require("../../Controllers/batch/batch.controller");
const { createBatchValidation, updateBatchValidation, listBatchesValidation } = require("../../validators/batches/batch.joi");
const { ADMIN } = require("../../Constants/roles.constants");

const BatchRoutes = express.Router();

BatchRoutes.route("/new-batch").post(Authentication, Authorization(ADMIN), createBatchValidation, createNewBatchController);
BatchRoutes.route("/list").get(Authentication, Authorization(ADMIN), listBatchesValidation, getBatchesListController);
BatchRoutes.route("/:batchId").put(Authentication, Authorization(ADMIN), updateBatchValidation, updateBatchController)
  .delete(Authentication, Authorization(ADMIN), deleteBatchController);
BatchRoutes.route("/:batchId/toggle-status").patch(Authentication, Authorization(ADMIN), toggleBatchStatusController);

module.exports = BatchRoutes;
