const { match } = require("assert");
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();

//create
router.post("/", verifyToken, async(req,res)=>{
    const newOrder = new Order(req.body);


    try {
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder);
    } catch (error) {
        res.status(500).json(error)
    }
})



//update
router.put("/:id",verifyTokenAndAdmin, async (req,res)=>{

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            {
                $set:req.body
            },
            {new:true}
        );

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error)
    }
});


///delete

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted......")
    } catch (err) {
        res.status(500).json(err)
    }
})

//get user Orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res)=>{
    // const  querys = req.query;
    // const  paramss = req.params;

    // console.log('querys:',querys)
    // console.log('paramss:',paramss)
    try {
        const orders = await Order.find({userId: req.params.userId});
        

        res.status(200).json(orders)
        
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all orders
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json(error)
    }
});
//get monthly income

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      console.log("income:",income)
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;