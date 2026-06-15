console.log('Proxy config loaded - target: http://localhost:8080');

module.exports = {
  '/alfresco': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', 'http://localhost:8080');
      }
    }
  }
};