const redisClient = require('../config/redisClient');
const MAX_REQUESTS = 10;
const WINDOW_TIME = 60 ;
// creating a rate limiter of 10 req/ sec per service ,using the jwt Rate limiter
async function jwtRateLimiter(req , res , next) {
        const userId = req.user.userId;
        if(!userId) return res.status(401).json({msg:"Unauthorized User"});
        const baseUrl = req.baseUrl
        const reqKey = `req:${baseUrl}:${userId}`
        const blockKey = `block:${baseUrl}:${userId}`
        const isBlocked = await redisClient.get(blockKey);
        if(isBlocked)return res.status(429).json({msg : "You were blocked initailly , wait for 1 min!!"});
        const requests = await redisClient.incr(reqKey);
        
        if (requests === 1){
            await redisClient.expire(reqKey ,WINDOW_TIME);
        }
        if(requests > MAX_REQUESTS){
            await redisClient.set(blockKey , 1 , {
                EX : WINDOW_TIME
            })
            return res.status(429).json({msg : "Too many requests ,We blocked for min, try again in minute"});

        }
        next();
}

module.exports = jwtRateLimiter;