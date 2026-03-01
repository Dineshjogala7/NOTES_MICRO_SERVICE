const express  = require("express");

const router = express.Router();
const  { createNote , getNote  , getNotesByCategory , deleteNote , updateNote} = require("../controllers/notes");


router.post("/createNote" , createNote);
router.get("/getNote/:noteId" , getNote);
router.get("/getNotesByCategory/:categoryId" , getNotesByCategory);
router.delete("/deleteNote/:noteId" , deleteNote);
router.put("/updateNote/:noteId" , updateNote);
module.exports  = router;