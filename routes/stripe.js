require('dotenv').config();
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);


router.post("/payment", (req, res)=>{

    console.log("req.body.tokenId:",req.body.tokenId)
    console.log("req.body.amount,:",req.body.amount)
    console.log("process.env.STRIPE_KEY:",process.env.STRIPE_KEY);

    stripe.charges.create({
        source: req.body.tokenId,
        amount:req.body.amount,
        currency:"usd",
    },(stripeErr, stripeRes)=>{
        if(stripeErr){
            console.log("stripeErr:",stripeErr)
            res.status(500).json(stripeErr);
        } else {
            console.log("stripeRes:",stripeRes)
            res.status(200).json(stripeRes);
        }
    });





})





module.exports = router; 
