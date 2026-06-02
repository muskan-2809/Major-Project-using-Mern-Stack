import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './route/authRoute.js'
import cors from 'cors'
import userRouter from './route/userRoute.js'
import courseRouter from './route/courseRoute.js'
import paymentRouter from './route/paymentRoute.js'
import reviewRouter from './route/reviewRoute.js'


dotenv.config()

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/images", express.static("public"))

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/course",courseRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/review", reviewRouter)

app.get("/",(req,res)=>{
    res.send("Hello from server")
})

 connectDb()
.then(()=>{
app.listen(port , ()=>{
    console.log(`server Started on port ${port}`)
});
})
.catch((error)=>{
    console.log("Database connection error:", error)
})