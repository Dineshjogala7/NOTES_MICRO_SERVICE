
async function internalAuthMiddleware(req , res , next) {
    try {
        const internalSecret = req.headers['x-internal-secret'];
        if (internalSecret !== process.env.INTERNAL_SECRET_KEY)return res.status(401).json({msg : "Invalid Authorization"});
        req.user = { userId: req.headers['x-user-id'] };
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg : "Server Error in inter Auth of category"})
    }
}

module.exports = internalAuthMiddleware;