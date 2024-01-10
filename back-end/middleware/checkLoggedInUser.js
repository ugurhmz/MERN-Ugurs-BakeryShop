import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js'; 

export const checkAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  console.log("token", token)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.userId = decoded.id
      req.user = await UserModel.findById(decoded.id).select('-password')
      
      next();
    } catch (err) {
      console.error(err)
      res.status(httpStatus.UNAUTHORIZED).json({ error: "Not authorized, token failed!!" })
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Invalid authorization header!!" })
  }
}
