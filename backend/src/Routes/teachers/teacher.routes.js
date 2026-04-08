const express = require("express");
const { Authentication, Authorization } = require("../../Middlewares/Auth.middleware");
const {
  createTeacherController,
  getTeachersListController,
  getSingleTeacherController,
  updateTeacherController,
  deleteTeacherController,
} = require("../../Controllers/teachers/teacher.controller");
const {
  createTeacherValidation,
  updateTeacherValidation,
  listTeachersValidation,
} = require("../../validators/teachers/teacher.joi");
const { ADMIN } = require("../../Constants/roles.constants");

const TeacherRoutes = express.Router();

TeacherRoutes.route("/")
  .get(Authentication, Authorization(ADMIN), listTeachersValidation, getTeachersListController)
  .post(Authentication, Authorization(ADMIN), createTeacherValidation, createTeacherController);

TeacherRoutes.route("/:teacherId")
  .get(Authentication, Authorization(ADMIN), getSingleTeacherController)
  .put(Authentication, Authorization(ADMIN), updateTeacherValidation, updateTeacherController)
  .delete(Authentication, Authorization(ADMIN), deleteTeacherController);

module.exports = TeacherRoutes;
