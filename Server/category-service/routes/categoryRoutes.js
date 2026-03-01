const express = require('express');

const { createCategory , getCategories , deleteByCategory  , updateCategory}= require("../controllers/category");

const router = express.Router();

router.post("/createCategory" , createCategory);
router.get("/getCategories" , getCategories );
router.delete("/deleteByCategory/:categoryId" , deleteByCategory);
router.put("/updateCategory/:categoryId" , updateCategory);

module.exports = router;