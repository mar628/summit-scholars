const express = require("express");
const { Authentication, Authorization } = require("../../Middlewares/Auth.middleware");
const {
  createFeeController,
  getFeesListController,
  getStudentFeesController,
  updateFeeController,
  deleteFeeController,
  getMyFeesController,
} = require("../../Controllers/fees/fee.controller");
const { createFeeValidation, updateFeeValidation, listFeesValidation } = require("../../validators/fees/fee.joi");
const { ADMIN, STUDENT } = require("../../Constants/roles.constants");

const FeeRoutes = express.Router();

// Student: view own fees — MUST be before /:feeId to avoid "my-fees" being treated as an ID
FeeRoutes.route("/my-fees")
  .get(Authentication, Authorization(STUDENT), getMyFeesController);

// Admin: list all fees / create fee
FeeRoutes.route("/")
  .get(Authentication, Authorization(ADMIN), listFeesValidation, getFeesListController)
  .post(Authentication, Authorization(ADMIN), createFeeValidation, createFeeController);

// Admin: get fees for a specific student
FeeRoutes.route("/student/:studentId")
  .get(Authentication, Authorization(ADMIN), getStudentFeesController);

// Admin: update / delete a specific fee
FeeRoutes.route("/:feeId")
  .put(Authentication, Authorization(ADMIN), updateFeeValidation, updateFeeController)
  .delete(Authentication, Authorization(ADMIN), deleteFeeController);

module.exports = FeeRoutes;
