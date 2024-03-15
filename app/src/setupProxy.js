const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/ws',
        createProxyMiddleware({
            target: 'http://localhost:8188',
            ws:true
        })
    );
    app.use(
        '/object_info/',
        createProxyMiddleware({
            target: 'http://localhost:8188',
            changeOrigin: true,
        })
    );
    app.use(
        '/prompt/',
        createProxyMiddleware({
            target: 'http://localhost:8188',
            changeOrigin: true,
        })
    );
    app.use(
        '/view',
        createProxyMiddleware({
            target: 'http://localhost:8188',
            changeOrigin: true,
        })
    );
};