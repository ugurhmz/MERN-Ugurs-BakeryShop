import express from 'express';
const router = express.Router();
import UserRouter from './routes/user.js' 

router.use("/user", UserRouter);

export default router;