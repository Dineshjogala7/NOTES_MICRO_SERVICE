const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get('/' , (req , res)=>{
    res.send("User service running");
})

app.listen(process.env.PORT , (err)=>{
    console.log("App is running on 5000");
})

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("User mongo is Connected"))
.catch((err)=>console.log("Error in User db connection" , err))