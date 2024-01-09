import UserModel from "../models/UserModel.js";
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import CryptoJs from 'crypto-js'
import nodemailer from 'nodemailer'

// REGISTER & Activation Link
export const registerUserController = async (req,res) => {

  const { firstName, lastName, email, username, password } = req.body;
  
  try {
      const existingUser = await UserModel.findOne({ email })

      if(existingUser) {
          return res.status(httpStatus.CONFLICT).json({ error: "This e-mail already exist !"})
      }

      const token = jwt.sign(
          {email},
          process.env.JWT_SECRET_KEY,
          {expiresIn: "7d"}
      )

      const newUser = new UserModel({
          firstName,
          lastName,
          email,
          username,
          password: CryptoJs.AES.encrypt(req.body.password, process.env.PAS_SECURITY),
          activationToken: token,
          isVerified: false
      })

      // save user
      const savedUser = await newUser.save()

      // Send E-mail verification
      const emailInfo = {
          from: process.env.EMAIL_FROM,
          to: email, // req.body.email
          subject: "Account activation link for register",
          html: `<h1>Please Click to activate your mail.</h1>
          <p>http://localhost:${process.env.PORT}/ugurv1/api/user/activation/${token}</p>
          <hr/> `,
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PW,
        },
      });

      transporter
      .sendMail(emailInfo)
      .then((sent) => {
        return res.status(httpStatus.OK).json({
          message: `Activation link,  has been sent to your ${email}.`,
        });
      })
      .catch((err) => {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: err,
        });
      });


  } catch (err) {
      console.log("register err: ", err)
      res.status(httpStatus[500]).json({
          error: "Registration failed !!"
      })
  }
}

// ACTIVATION LINK
export const userActivationController = async (req,res) => {
  try {
      const paramToken = req.params.token
      const findUserWithToken = await UserModel.findOne({
          activationToken: paramToken
      })

      if (findUserWithToken) {
          findUserWithToken.activationToken = null
          findUserWithToken.isVerified = true

         await findUserWithToken.save();

          return res.status(httpStatus.OK).json({
              message:"Registration successful. . ."
          })
      } else {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              error: "E-mail not verified !!"
          });
      }

  } catch(error) {
      res.status(httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS).json({
        error
      })
  }
}

//  LOGIN
export const userLoginController = async ( req,res) => {
  try {

    const findUser = await UserModel.findOne({
      email: req.body.email
    })
    
    if(!findUser){
      return  res.status(httpStatus.NOT_FOUND).json({
          message: `No user found with this email: ${req.body.email}`
        })
    }

    if(!findUser.isVerified) {
      return res.status(httpStatus.NON_AUTHORITATIVE_INFORMATION).json({
        error: "Not Activated !!"
      })
    }

    const decryptUserPassword = CryptoJs.AES.decrypt(findUser.password, process.env.PAS_SECURITY);
    const userDbPassword = decryptUserPassword.toString(CryptoJs.enc.Utf8);

    if (userDbPassword !== req.body.password) {
      return res.status(httpStatus.NOT_FOUND).json({
        error: "Invalid password !",
      })
    }

    const loginToken = jwt.sign(
      {
        id: findUser._id
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d"}
    )

    console.log("login token", loginToken)
    const { password, ...userWithOutPassword } = findUser._doc
    res.status(httpStatus.OK).json({
       ...userWithOutPassword,
       loginToken
    })


  } catch(err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      err
    })
  }
}