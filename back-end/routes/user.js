import express from 'express';
import {
    registerUserController, userActivationController, userLoginController, userUpdateController
} from '../controller/UserController.js';
import validate from '../middleware/validate.js';
import { registerValidation, loginValidation, updateValidation } from "../validations/UserValidate.js";
import  {checkAuthenticated}  from '../middleware/checkLoggedInUser.js';

const router = express.Router();

router.post("/register", validate(registerValidation), registerUserController);
router.get("/activation/:token", userActivationController);
router.post("/login",validate(loginValidation),userLoginController)
router.put("/update",validate(updateValidation), checkAuthenticated, userUpdateController)

export default router;