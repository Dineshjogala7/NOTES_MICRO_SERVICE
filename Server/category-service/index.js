const express = require("express");
require('dotenv').config();

const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/" , (req , res)=>{
    res.send("category - service is running !");
})

app.listen(process.env.PORT , ()=>{
    console.log("App is running on the port 5002");
})

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Category mongo is Connected"))
.catch((err)=>console.log("Error in Category db connection" , err))