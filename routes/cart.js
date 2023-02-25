const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();

//create
router.post("/", verifyToken, async(req,res)=>{
    const newCart = new Cart(req.body);


    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error)
    }
})



//update
router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>{

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id, 
            {
                $set:req.body
            },
            {new:true}
        );

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error)
    }
});


///delete

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted......")
    } catch (err) {
        res.status(500).json(err)
    }
})

//get Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res)=>{
    // const  querys = req.query;
    // const  paramss = req.params;

    // console.log('querys:',querys)
    // console.log('paramss:',paramss)
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        

        res.status(200).json(cart)
        
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all products
router.get("/", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);

    } catch (error) {
        res.status(200).json(error)
    }
})

module.exports = router;