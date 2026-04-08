const { celebrate, Joi } = require("celebrate");

const createFeeValidation = celebrate({
  body: Joi.object({
    studentId: Joi.string().required().label("Student"),
    title: Joi.string().required().min(2).max(100).label("Title"),
    amount: Joi.number().required().min(0).label("Amount"),
    dueDate: Joi.date().required().label("Due Date"),
    description: Joi.string().max(300).optional().allow("").label("Description"),
    month: Joi.string().max(20).optional().allow("").label("Month"),
  }),
});

const updateFeeValidation = celebrate({
  body: Joi.object({
    title: Joi.string().min(2).max(100).optional().label("Title"),
    amount: Joi.number().min(0).optional().label("Amount"),
    dueDate: Joi.date().optional().label("Due Date"),
    status: Joi.string().valid("pending", "paid", "overdue", "cancelled").optional().label("Status"),
    paidDate: Joi.date().optional().label("Paid Date"),
    description: Joi.string().max(300).optional().allow("").label("Description"),
    month: Joi.string().max(20).optional().allow("").label("Month"),
  }),
});

const listFeesValidation = celebrate({
  query: Joi.object({
    studentId: Joi.string().optional().label("Student ID"),
    status: Joi.string().valid("pending", "paid", "overdue", "cancelled").optional().label("Status"),
  }),
});

module.exports = { createFeeValidation, updateFeeValidation, listFeesValidation };
