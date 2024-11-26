const express =  require("express")
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 3300
app.use(express.json())
//importing mongoDB connection
const connection = require("./config/db")

// auth middleware
const authMiddleware = require("./middleware/auth.middleware")



// user route 
const userRouter = require("./user_routes/user")
app.use("/api/user", userRouter)


//product routes
const productRouter = require("./product_routes/product.route")
app.use("/api/product", productRouter)

// payment routes
const paymentRouter = require("./product_routes/payment.route")
app.use("/api/payment",authMiddleware, paymentRouter)

// cart routes 
const cartRouter = require("./product_routes/cart.route")
app.use("/api/cart",authMiddleware, cartRouter)

//order routes
const orderRouter = require("./product_routes/order.route")
app.use("/api/order",authMiddleware, orderRouter)

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
