import Joi from 'joi'

// Register validation
export const registerValidation = Joi.object({
    email: Joi.string().email().required().min(8),
    username: Joi.string().required().min(3).max(75),
    password: Joi.string().required().min(6),
    firstName: Joi.string().required().min(2).max(100),
    lastName: Joi.string().required().min(2).max(100),
    userImg: Joi.string().default("default.png")
})