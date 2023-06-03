const express = require('express')

const app = express()

const mongoose = require('mongoose')
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const stripeRoute = require("./routes/stripe");
const cors = require("cors")

dotenv.config();

app.use(cors())
app.options('*',cors())

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("DBConnection Successful"))
    .catch((err) => {
        console.log(err);
    });



app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);
app.use("/api/checkout", stripeRoute);


app.listen(process.env.PORT||443, () => {
    console.log("backend server is running")


});