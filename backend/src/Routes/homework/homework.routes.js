const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN, TEACHER } = require("../../Constants/roles.constants");
const {
  createStudentHomeworkController,
  getSingleHomeworkController,
  getHomeworkListController,
  assignHomeworkRatingController,
  updateHomeworkController,
  deleteHomeworkController,
} = require("../../Controllers/homework/homework.controller");
const {
  createStudentHomeworkValidation,
  getHomeworkListValidation,
  assignHomeworkRatingValidation,
  updateHomeworkValidation,
} = require("../../validators/homework/homework.joi");
const {
  currentBatchDetailMiddleWare,
} = require("../../Middlewares/batch.middleware");

const HomeworkRoutes = express.Router();

HomeworkRoutes.route("/assign-new-homework/:studentId").post(
  Authentication,
  Authorization(ADMIN, TEACHER),
  currentBatchDetailMiddleWare,
  createStudentHomeworkValidation,
  createStudentHomeworkController
);

HomeworkRoutes.route("/homework-list").get(
  Authentication,
  Authorization(ADMIN, TEACHER),
  getHomeworkListValidation,
  getHomeworkListController
);

HomeworkRoutes.route("/:homeworkId")
  .get(Authentication, Authorization(ADMIN, TEACHER), getSingleHomeworkController)
  .put(
    Authentication,
    Authorization(ADMIN, TEACHER),
    updateHomeworkValidation,
    updateHomeworkController
  )
  .delete(Authentication, Authorization(ADMIN, TEACHER), deleteHomeworkController);

HomeworkRoutes.route("/assign-rating/:homeworkId").patch(
  Authentication,
  Authorization(ADMIN, TEACHER),
  assignHomeworkRatingValidation,
  assignHomeworkRatingController
);

module.exports = HomeworkRoutes;
