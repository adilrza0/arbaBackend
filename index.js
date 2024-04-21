const express=require("express")
const cors=require("cors");
const connection = require("./db");

const { authRouter } = require("./Routers/auth.router");
const { userRouter } = require("./Routers/user.router");
require("dotenv").config()

const app=express();

app.use(cors())
app.use(express.json());

app.use("/auth",authRouter)
app.use("/user",userRouter)

app.listen(process.env.port,async()=>{
    await connection
    console.log("Connected to DB")
    console.log(`server running at port - ${process.env.port}`)
})