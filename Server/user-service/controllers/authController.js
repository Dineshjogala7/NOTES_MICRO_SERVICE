const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
async function register(req , res) {
    try {
        const {name , email , password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)return res.status(400).json({msg : "User already existed"});
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await User.create({
            email , name , password:hashedPassword
        });
        const token = jwt.sign({userId:newUser._id , email:newUser.email} , process.env.SECRET_KEY , {expiresIn : '1d'});
        res.cookie(process.env.COOKIE_NAME , token , {
            httpOnly : false,
            sameSite : "lax" ,
        });
        res.status(201).json({msg : "User registered successfully"})
    } catch (error) {
        console.log(error , "Server error in register");
        return res.status(500).json({msg : "Server Error "});
    }
}

async function  login(req , res) {
    try {
        const {email , password} = req.body;
        const existingUser = await User.findOne({email})
        if(!existingUser)return res.status(404).json({msg : "User not found"});
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch) return res.status(400).json({msg : "Invalid Password"});
        
        const token = jwt.sign({userId : existingUser._id ,email : existingUser.email} , process.env.SECRET_KEY , {expiresIn : '1d'});
        res.cookie(process.env.COOKIE_NAME , token , {
            httpOnly: false,
            sameSite :'lax'
        })
        return res.status(200).json({msg : "User Logged successfully !"});
    } catch (error) {
        return res.status(500).json({msg: "Server Error"})
    }
}


async function logout(req , res) {
    res.clearCookie(process.env.COOKIE_NAME , {
        httpOnly : true ,
        sameSite : "lax"
    });
    return res.json({msg : "User logged out successfully"})
}

module.exports = {register , login , logout};