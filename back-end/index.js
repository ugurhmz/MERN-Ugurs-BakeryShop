import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import connectDB from './database/db.js'
import cors from 'cors'

// MongoDB
connectDB()

const app = express()
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());




app.get("/", (req,res) => {
    res.send("Hello World . . .")
})

app.listen(process.env.PORT || 7500, () => {
    console.log(`Listening: ${process.env.PORT}`)
})