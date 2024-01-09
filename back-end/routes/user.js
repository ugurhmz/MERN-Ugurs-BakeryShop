import express from 'express'
import {
    registerUserController, userActivationController
} from '../controller/UserController'
import validate from '../middleware/validate.js'
import schemas from "../validations/UserValidate.js";


const router = express.Router()

router.post("/register", validate(schemas.registerValidation) ,registerUserController)
router.get("/activation/:token", userActivationController)

export default router