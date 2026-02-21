const express = require("express");
const redisClient = require('./config/redisClient');
require("dotenv").config()

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json);
app.use(express.urlencoded({extended:true}));

app.get("/" , (req , res)=>{
    res.send("API - gateway is running");
})

app.listen(process.env.PORT , ()=>{
    console.log("App is running on the port 5003");
})

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("API mongo is Connected"))
.catch((err)=>console.log("Error in API db connection" , err))