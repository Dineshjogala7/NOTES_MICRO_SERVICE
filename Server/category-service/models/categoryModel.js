const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    userId : {
        type : String ,
        required : true
    }
} , {timestamps :  true});

module.exports = mongoose.model("categoryModel"   , categorySchema);