const redis = require('redis');

const redisClient = redis.createClient({
    url :"redis://redis:6379"
})

redisClient.connect().then(()=>{console.log("Redis Client connected");}).
catch((err)=>console.log("redisClient Error"))

module.exports = redisClient;