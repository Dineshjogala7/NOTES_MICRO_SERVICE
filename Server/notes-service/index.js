const express = require("express");

require("dotenv").config()

const app = express();
const cors = require('cors')
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get("/" , (req , res)=>{
    res.send("notes - service")
})

app.listen(process.env.PORT , ()=>{
    console.log("App is running on the port 5001");
})
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Notes mongo is Connected"))
.catch((err)=>console.log("Error in Notes db connection" , err))