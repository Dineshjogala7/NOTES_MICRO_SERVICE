const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
    target : "http://category-service:5002",
    changeOrigin :  true,
    pathRewrite : {
        "^/api/category" : ""
    },
    on :{
        proxyReq :(proxyReq,req)=>{
            proxyReq.setHeader("x-internal-secret" , process.env.INTERNAL_SECRET_KEY);
            proxyReq.setHeader("x-user-id", req.user.userId);
        },
        error : (err , req ,res)=>{
            console.error('category proxy error');
            return res.status(500).json({error : "Proxy Error" , msg :err.message});
        }
    }
});