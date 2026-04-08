const express = require("express");
const { Authentication, Authorization } = require("../../Middlewares/Auth.middleware");
const {
  createProgressController,
  getMyProgressController,
  updateProgressController,
  deleteProgressController,
  getTeacherProgressController,
} = require("../../Controllers/teaching-progress/teachingProgress.controller");
const { ADMIN, TEACHER } = require("../../Constants/roles.constants");

const TeachingProgressRoutes = express.Router();

TeachingProgressRoutes.route("/")
  .get(Authentication, Authorization(TEACHER), getMyProgressController)
  .post(Authentication, Authorization(TEACHER), createProgressController);

TeachingProgressRoutes.route("/:progressId")
  .put(Authentication, Authorization(TEACHER), updateProgressController)
  .delete(Authentication, Authorization(TEACHER), deleteProgressController);

TeachingProgressRoutes.route("/teacher/:teacherId")
  .get(Authentication, Authorization(ADMIN), getTeacherProgressController);

module.exports = TeachingProgressRoutes;
