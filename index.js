const express =  require("express")
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 3300
app.use(express.json())
//importing mongoDB connection
const connection = require("./config/db")

// user route 
const userRouter = require("./user_routes/user")
app.use("/api/user", userRouter)


//product routes
const productRouter = require("./product_routes/product.route")
app.use("/api/product", productRouter)

app.get("/",(req, res)=>{
    res.send("hello world,")
})











app.listen(PORT, async()=>{
    try {
        await connection
        console.log(`server is running on PORT ${PORT}`)
    } catch (error) {
        console.log("something went wrong while connecting to server")
    }
   
})
