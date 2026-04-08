const { celebrate, Joi } = require("celebrate");

const createTeacherValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(100).label("Name"),
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string().required().min(7).max(15).label("Phone"),
    subject: Joi.string().required().min(2).max(100).label("Subject"),
    qualification: Joi.string().required().min(2).max(200).label("Qualification"),
    experience: Joi.number().required().min(0).max(60).label("Experience"),
    gender: Joi.string().valid("male", "female", "other").required().label("Gender"),
    address: Joi.string().required().min(5).max(300).label("Address"),
    joiningDate: Joi.date().optional().label("Joining Date"),
  }),
});

const updateTeacherValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional().label("Name"),
    phone: Joi.string().min(7).max(15).optional().label("Phone"),
    subject: Joi.string().min(2).max(100).optional().label("Subject"),
    qualification: Joi.string().min(2).max(200).optional().label("Qualification"),
    experience: Joi.number().min(0).max(60).optional().label("Experience"),
    gender: Joi.string().valid("male", "female", "other").optional().label("Gender"),
    address: Joi.string().min(5).max(300).optional().label("Address"),
    joiningDate: Joi.date().optional().label("Joining Date"),
    isActive: Joi.boolean().optional().label("Is Active"),
  }),
});

const listTeachersValidation = celebrate({
  query: Joi.object({
    sort: Joi.string().valid("-createdAt", "+createdAt").optional().label("Sort Order"),
  }),
});

module.exports = {
  createTeacherValidation,
  updateTeacherValidation,
  listTeachersValidation,
};
