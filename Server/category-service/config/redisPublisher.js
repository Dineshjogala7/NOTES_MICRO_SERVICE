const redis = require("redis");

const publisher =  redis.createClient({
    url : "redis://redis:6379"
});

publisher.connect().then(()=> console.log("Redis Publisher connected successfully!!")).
catch((err)=>console.log("Error in Redis publisher" , err));

module.exports = publisher;