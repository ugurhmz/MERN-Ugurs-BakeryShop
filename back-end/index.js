import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import connectDB from './database/db.js'
import appRoutes from './AppRoutes.js'
import cors from 'cors'