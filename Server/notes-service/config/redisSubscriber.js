const redis = require("redis");

const subscriber = redis.createClient({
    url : "redis://redis:6379"
});

subscriber.connect().then(()=>{
    console.log("Redis Subscriber is conncted")
}).catch((err)=>console.log("error in connecting the redis subscriber" , err));

module.exports = subscriber;