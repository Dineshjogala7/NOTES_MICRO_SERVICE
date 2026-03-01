const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = createProxyMiddleware({
    target : "http://notes-service:5001",
    changeOrigin :  true,
    pathRewrite :{
        "^/api/notes":""
    },
    on :{
        proxyReq :(proxyReq,req)=>{
            proxyReq.setHeader("x-internal-secret" , process.env.INTERNAL_SECRET_KEY);
            proxyReq.setHeader("x-user-id", req.user.userId);
        },
        error : (err , req , res)=>{
            console.error('notes proxy error', err);
            if (!res.headersSent) {
                res.status(500).json({error : "Proxy Error" , msg :err.message});
            }
        }
    }
});