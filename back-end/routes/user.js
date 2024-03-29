import express from 'express';
import {
    confirmResetPassword,
    registerUserController, resetPasswordController, userActivationController, userLoginController, userUpdateController
} from '../controller/UserController.js';
import validate from '../middleware/validate.js';
import { registerValidation, loginValidation, updateValidation } from "../validations/UserValidate.js";
import  {checkAuthenticated}  from '../middleware/checkLoggedInUser.js';

const router = express.Router();

router.post("/register", validate(registerValidation), registerUserController);
router.get("/activation/:token", userActivationController);
router.post("/login",validate(loginValidation),userLoginController)
router.put("/update",validate(updateValidation), checkAuthenticated, userUpdateController)
router.post("/reset-password", resetPasswordController);  // reset linkini gönderir
router.get("/reset-password", confirmResetPassword);  // reset linkine tıkladığında, random pw'yi setler.
export default router;