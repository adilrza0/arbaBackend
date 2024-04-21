const express=require("express")
const cors=require("cors");
const connection = require("./db");

const { authRouter } = require("./Routers/auth.router");
const { userRouter } = require("./Routers/user.router");
const { productRouter } = require("./Routers/product.router");
const categoryRouter = require("./Routers/category.router");
require("dotenv").config()

const app=express();

app.use(cors())
app.use(express.json());

app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/products",productRouter)
app.use("/category",categoryRouter)

app.listen(process.env.port,async()=>{
    await connection
    console.log("Connected to DB")
    console.log(`server running at port - ${process.env.port}`)
})