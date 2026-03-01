const Note = require("../models/Notes");
const subscriber = require("../config/redisSubscriber");

function startCategoryEvents(){
    subscriber.subscribe("CATEGORY_DELETE" , async(message) =>{
        try {
            const {categoryId ,userId} = JSON.parse(message);
            await Note.deleteMany({categoryId , userId});
            console.log("Event Category Deleted");
        } catch (error) {
            console.log("Error in deleting the notes");
        }
    })
}

module.exports  = startCategoryEvents;