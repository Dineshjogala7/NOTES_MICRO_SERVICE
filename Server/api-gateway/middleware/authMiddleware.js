const { json } = require("express");
const jwt = require("jsonwebtoken");

async function authMiddleware(req , res , next) {
    try {
        const token = req.cookies[process.env.COOKIE_NAME];
        if(!token) return res.status(401).json({msg : "No token is provided"});
        const decoded = jwt.verify(token , process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Jwt error ",error.message);
        return res.status(403).json({msg : "Invalid or expired Token"});
    }
}

module.exports = authMiddleware;