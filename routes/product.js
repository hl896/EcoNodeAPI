const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();


router.post("/", verifyTokenAndAdmin, async(req,res)=>{
    const newProduct = new Product(req.body);


    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})




router.put("/:id",verifyTokenAndAdmin, async (req,res)=>{
    if(req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(
            req.body.password, process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedProducted = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                $set:req.body
            },
            {new:true}
        );

        res.status(200).json(updatedProducted);
    } catch (error) {
        res.status(500).json(error)
    }
});


///delete

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted......")
    } catch (err) {
        res.status(500).json(err)
    }
})

//get pRODUCT
router.get("/find/:id", async (req,res)=>{
    // const  querys = req.query;
    // const  paramss = req.params;

    // console.log('querys:',querys)
    // console.log('paramss:',paramss)
    try {
        const product = await Product.findById(req.params.id);
        

        res.status(200).json(product)
        
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/search', async(req,res)=>{
    
    
    try {
        const titleStr = req.query.title
        console.log("req.query: ",titleStr)
        const regex = new RegExp(titleStr, 'i') // i for case insensitive

        const product = await Product.find({title:{ $regex: regex}});
        console.log("search product:", product)
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
});


//get all products
router.get("/", async (req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if(qNew){
            products= await Product.find().sort({createdAt:-1}).limit(5);
        }else if(qCategory){
            products = await Product.find({categories:{
                $in:[qCategory]
            }})
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;