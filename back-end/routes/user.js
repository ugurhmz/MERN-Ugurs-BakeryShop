import express from 'express';
import {
    registerUserController, userActivationController
} from '../controller/UserController.js';
import validate from '../middleware/validate.js';
import { registerValidation } from "../validations/UserValidate.js";

const router = express.Router();

router.post("/register", validate(registerValidation), registerUserController);
router.get("/activation/:token", userActivationController);

export default router;