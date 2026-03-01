const express = require('express')
require('dotenv').config()
const app = express()

const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get('/' , (req , res)=>{
    res.send("User service running");
})
app.use("/auth" , authRoutes);
app.listen(process.env.PORT , (err)=>{
    console.log(`User service is running on ${process.env.PORT}`);
})

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("User mongo is Connected"))
.catch((err)=>console.log("Error in User db connection" , err))