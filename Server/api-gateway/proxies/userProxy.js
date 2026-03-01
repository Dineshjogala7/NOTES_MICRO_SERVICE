const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
    target: "http://user-service:5000",
    changeOrigin: true, // This automatically sets the Host header and handles Origin logic
    pathRewrite: {
        "^/api/users": ""
    }
    // No 'on' block needed for manual body parsing or header removal!
});