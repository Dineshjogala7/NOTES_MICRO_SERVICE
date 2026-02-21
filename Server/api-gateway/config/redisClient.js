const redis = require("redis");

const client = redis.createClient({
    url : "redis://redis:6379"
});

client.connect().
then(()=>console.log("Redis Connected"))
.catch((err)=>console.log("Redis Error" , err));

module.exports = client;