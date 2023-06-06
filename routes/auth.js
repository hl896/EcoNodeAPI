const router = require("express").Router();

const User = require("../models/User");
const CryptoJs = require("crypto-js")


const jwt = require("jsonwebtoken")

router.post("/register", async (req,res)=>{
    const newUser = new User(
        {
            username:req.body.username,
            email:req.body.email,
            password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        }
    );
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error)
    }
        
});

//LOGIN
router.post("/login", async(req,res)=>{
    try {
      
        console.log("req.body.username:",req.body.username)

        const user = await User.findOne({username:req.body.username})
        if(!user){

            console.log("no such user")
            console.log("user:",user)
            !user && res.status(401).json("Wrong Credentials!"+user)
        }else{
            console.log("user:",user)

            const hashedPassword = CryptoJs.AES.decrypt(
                user.password,
                process.env.PASS_SEC
    
            )
    
            const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8)
    
    
            OriginalPassword !==req.body.password && 
                res.status(401).json("Wrong credentials!"+password);
    
                const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, 
                process.env.JWT_SEC,
                {expiresIn:"3d"}
                );
    
            const {password, ...others} = user._doc;
    
            res.status(200).json({...others, accessToken});

        }


        
        
    } catch (error) {
        res.status(500).json(error)
    }
     
})

module.exports = router;